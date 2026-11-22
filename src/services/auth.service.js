
const db = require("../config/database");
const bcrypt = require("bcrypt");

async function registerUser(userData) {
    const { name, email, password } = userData;

    // 1. Check whether email already exists
    const existingUser = await db("users")
        .where({ email })
        .first();

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
                password: hashedPassword
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
            user: newUser
        };

    } catch (error) {

        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error(
                "Email is already registered"
            );

            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
}

module.exports = {
    registerUser
};
