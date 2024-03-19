const express = require("express");
const cors = require("cors");
const userRouter = require("./app/routes/user.route");
const todoRouter = require("./app/routes/todo.route");
const ApiError = require("./app/api-errors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome"})
})

app.use("/api/user", userRouter);
app.use("/api/todolist", todoRouter);


app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
})

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    })
})

module.exports = app;