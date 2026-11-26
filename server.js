const express = require("express");
const db = require("./src/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const env = require("./src/config/env");

const { errorHandler } = require("./src/middleware/error.middleware");
const { notFound } = require("./src/middleware/not-found.middleware");
const authRoutes = require("./src/routes/auth.routes");
const dashboardRoutes = require('./src/routes/dashboard.routes')

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/test-cookie", (req, res) => {
  res.cookie("username", "David", {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });

  res.json({
    message: "Cookie created successfully",
  });
});

app.get("/read-cookie", (req, res) => {
  const username = req.cookies.username;

  res.json({
    username: username,
  });
});

app.get("/delete-cookie", (req, res) => {
  res.clearCookie("username");

  res.json({
    message: "Cookie deleted",
  });
});

app.use(notFound);

app.use(errorHandler);

const PORT = env.port;

async function startServer() {
  try {
    await db.raw("SELECT 1");

    console.log("MySQL connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
