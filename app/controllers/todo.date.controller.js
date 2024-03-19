const ApiError = require("../api-errors");
const ToDoServices = require("../services/todo.services");
const MongoDB = require("../utils/mongodb.util");

exports.getAllDate = async function(req, res, next) {
    try{
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const date = await todoService.getAllDate();
        if(date) return res.send(date);
        return next(new ApiError(404, "Bạn chưa tạo ngày nào"))
    }
    catch(e) {
        console.log(e)
        return next(new ApiError(500, "An error occur while getting dates"))
    }
}

exports.getDate = async function (req, res, next) {
    try{
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const date = await todoService.getDate(req.params.dateId || null);
        if(date) return res.send(date);
    }
    catch(e) {
        console.log(e)
        return next(new ApiError(500, "An error occur while getting date"))
    }
}

exports.createDate = async function (req, res, next) {
    try{
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const result = await todoService.createDate(req.body);
        if(!result) return next (new ApiError(409, "Bạn đã tạo ngày này rồi"));
        return res.json(result); 
    }
    catch(e) {
        console.log(e);
        return next(new ApiError(500, "An error occur while creating date"))
    }
}

exports.deleteDate = async function (req, res, next) {
    try{
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const result = await todoService.deleteDate(req.params.dateId);
        if(result) return res.send({"message": "Deleting date successfully"})
        return next(new ApiError(404, "Date not found"))
    }
    catch(e) {
        console.log(e);
        return next(new ApiError(500, "An error occur while deleting date"))
    }
}

exports.updateDate = async function (req, res, next) {
    try{
        const newDate = req.body.date
        const todoService = new ToDoServices(MongoDB.client, req.params.userCollection);
        const result = await todoService.updateDate(newDate, req.params.dateId);
        if(!result) return next(new ApiError(409,  `Ngày ${newDate} đã được tạo`)) 
        return res.send(result)
    }
    catch(e) {
        console.log(e);
        return next(new ApiError(500, "An error occur while updating date"))
    }
}