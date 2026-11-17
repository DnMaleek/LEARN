const express = require("express");
const db = require("./src/config/database");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Welcome to our API");
});

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