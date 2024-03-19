const ApiError = require("../api-errors");
const UserService = require("../services/user.services");
const MongoDB = require("../utils/mongodb.util");

exports.createUser = async (req, res, next) => {
    try{
        const userService = await new UserService(MongoDB.client);
        const user = await userService.create(req.body);
        if(user)
            return res.send({message: "Creating account successfully"})
        return next(new ApiError(400, "Account has already been created"))
    }
    catch (err){
        return next(new ApiError(500, "An error occur while creating an account"))
    }
}

exports.checkLogIn = async (req, res, next) => {
    try{
        const userService = new UserService(MongoDB.client);
        const checkAccount = await userService.check(req.params)
        if(!checkAccount)
            return next(new ApiError(403, "Username or password is wrong"));
        return res.send({message: "Log in successfully"})
    }
    catch (err) {
        console.log(err)
        return next(new ApiError(500, "An error occur while checking an account"))
    }
}