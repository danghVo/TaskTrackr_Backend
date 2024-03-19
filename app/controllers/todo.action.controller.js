const ApiError = require("../api-errors");
const ToDoServices = require("../services/todo.services");
const MongoDB = require("../utils/mongodb.util");

exports.createToDo = async function (req, res, next) {
    try{
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const result = await todoService.createToDo(req.params.dateId, req.body);
        if(!result) return next (new ApiError(409, "Tên này đã được tạo"));
        return res.json(result); 
    }
    catch(e) {
        console.log(e);
        return next(new ApiError(500, "An error occur while creating date"))
    }
}

exports.deleteTodo = async function (req, res, next) {
    try{
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const result = await todoService.deleteToDo(req.params.dateId, req.params.todoId);
        if(result) return res.send({"message": "Deleting todo successfully"})
        return next(new ApiError(404, "ToDo not found"))
    }
    catch(e) {
        console.log(e);
        return next(new ApiError(500, "An error occur while deleting date"))
    }
}

exports.changeNameTodo = async function (req, res, next) {
    try{
        const newToDo = req.body.todoName
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const result = await todoService.changeNameTodo(req.params.dateId, req.params.todoId, req.body);
        if(!result) return next(new ApiError(409,  `${newToDo} đã được tạo`)) 
        return res.send(result)
    }
    catch(e) {
        console.log(e);
        return next(new ApiError(500, "An error occur while updating date"))
    }
}

exports.createAction = async function (req, res, next) {
    try{
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const result = await todoService.createAction(req.params.dateId, req.params.todoId, req.body);
        if(!result) return next (new ApiError(409, "Bạn đã tạo ngày này rồi"));
        return res.json(result); 
    }
    catch(e) {
        console.log(e);
        return next(new ApiError(500, "An error occur while creating action"))
    }
}

exports.deleteAction = async function (req, res, next) {
    try{
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const result = await todoService.deleteAction(req.params.dateId, req.params.todoId, req.params.actionId);
        if(result) return res.send({"message": "Deleting action successfully"})
        return next(new ApiError(404, "Action not found"))
    }
    catch(e) {
        console.log(e);
        return next(new ApiError(500, "An error occur while deleting date"))
    }
}

exports.updateAction = async function (req, res, next) {
    try{
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const result = await todoService.updateAction(req.params.dateId, req.params.todoId, req.params.actionId, req.body);
        return res.send(result)
    }
    catch(e) {
        console.log(e);
        return next(new ApiError(500, "An error occur while updating date"))
    }
}