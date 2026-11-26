const db = require("../config/database");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken,verifyRefreshToken} = require("../utils/jwt");

const crypto = require("crypto");

async function registerUser(userData) {
  const { name, email, password } = userData;

  // 1. Check whether email already exists
  const existingUser = await db("users").where({ email }).first();

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 3. Start database transaction
    const newUser = await db.transaction(async (trx) => {
      // Insert user
      const [userId] = await trx("users").insert({
        name,
        email,
        password: hashedPassword,
      });

      // Retrieve inserted user
      const user = await trx("users")
        .select("id", "name", "email", "role", "created_at")
        .where({ id: userId })
        .first();

      return user;
    });

    return {
      message: "Registration successful",
      user: newUser,
    };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const duplicateError = new Error("Email is already registered");

      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
}

async function loginUser(userData) {
  const { email, password } = userData;

  // 1. Find user
  const user = await db("users").where({ email }).first();

  // 2. Check whether user exists
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 3. Compare submitted password with stored hash
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  // 4. Reject incorrect password
  if (!isPasswordCorrect) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  //Hash the refresh token
  const refreshTokenHash = hashToken(refreshToken);

  // Calculate refresh token expiration
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Save hashed refresh token
  await db("refresh_tokens").insert({
    user_id: user.id,
    token_hash: refreshTokenHash,
    expires_at: expiresAt,
  });

  // 5. Return authenticated user
  return { user, accessToken, refreshToken };
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function refreshUserSession(rawRefreshToken) {
    let decoded;

    try {
        decoded = verifyRefreshToken(rawRefreshToken);
    } catch (error) {
        const authError = new Error("Invalid or expired refresh token");
        authError.statusCode = 401;
        throw authError;
    }

    const tokenHash = hashToken(rawRefreshToken);

    const result = await db.transaction(async (trx) => {
        const storedToken = await trx("refresh_tokens")
            .where({ token_hash: tokenHash })
            .whereNull("revoked_at")
            .where("expires_at", ">", trx.fn.now())
            .forUpdate()
            .first();

        if (!storedToken) {
            const authError = new Error("Invalid or expired refresh token");
            authError.statusCode = 401;
            throw authError;
        }

        const user = await trx("users")
            .where({ id: decoded.id })
            .first();

        if (!user) {
            const authError = new Error("Invalid or expired refresh token");
            authError.statusCode = 401;
            throw authError;
        }

        if (storedToken.user_id !== user.id) {
            const authError = new Error("Invalid or expired refresh token");
            authError.statusCode = 401;
            throw authError;
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const newTokenHash = hashToken(refreshToken);

        const expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await trx("refresh_tokens")
            .where({ id: storedToken.id })
            .update({
                revoked_at: trx.fn.now()
            });

        await trx("refresh_tokens").insert({
            user_id: user.id,
            token_hash: newTokenHash,
            expires_at: expiresAt
        });

        return {
            accessToken,
            refreshToken
        };
    });

    return result;
}

async function logoutUser(rawRefreshToken) {
    if (!rawRefreshToken) {
        return;
    }

    const tokenHash = hashToken(rawRefreshToken);

    await db("refresh_tokens")
        .where({ token_hash: tokenHash })
        .whereNull("revoked_at")
        .update({
            revoked_at: db.fn.now()
        });
}

module.exports = {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser
};
