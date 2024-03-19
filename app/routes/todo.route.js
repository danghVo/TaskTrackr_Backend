const express = require("express");
const date = require("../controllers/todo.date.controller");
const action = require("../controllers/todo.action.controller");
const router = express.Router();

router.route("/:userCollection/date")
    .get(date.getAllDate)
    .post(date.createDate)

router.route("/:userCollection/:dateId")
    .get(date.getDate)
    .put(date.updateDate)
    .delete(date.deleteDate)

router.route("/:userCollection/:dateId/todo")
    .post(action.createToDo)

router.route("/:userCollection/:dateId/:todoId")
    .put(action.changeNameTodo)
    .delete(action.deleteTodo)    

router.route("/:userCollection/:dateId/:todoId/action")
    .post(action.createAction)

router.route("/:userCollection/:dateId/:todoId/:actionId")
    .put(action.updateAction)
    .delete(action.deleteAction)

module.exports = router;