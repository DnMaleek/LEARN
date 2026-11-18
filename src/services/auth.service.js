const db = require("../config/database");
const bcrypt = require("bcrypt");

async function registerUser(userData) {
  const { name, email, password } = userData;

  const existingUser = await db("users").where({ email }).first();

  if (existingUser) {
    const error = new Error("Email is already registered");

    error.statusCode = 409;

    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db("users").insert({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const duplicateError = new Error("Email is already registered");
      duplicateError.statusCode = 409;

      throw duplicateError;
    }

    throw error;
  }
  return {
    message: "registration sucessfully",
  };
}

module.exports = {
  registerUser,
};
