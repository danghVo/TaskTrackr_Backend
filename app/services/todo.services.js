const { ObjectId } = require("mongodb");

class ToDoServices
{
    constructor(client, userCollection){
        this.todo = client.db().collection(`${userCollection}`);

        if(this.todo === null)
            client.db().createCollection(`${userCollection}`);
        this.todo = client.db().collection(`${userCollection}`);
    }

    async find(filter) {
        const date = await this.todo.findOne(filter);
        return date;
    }

    // date
    async getAllDate() {
        const result = await this.todo.find().project({date: 1}).toArray();
        return result
    }

    async getDate(id) {   
        const result = await this.todo.findOne({"_id": ObjectId.isValid(id) ? new ObjectId(id) : null})
        return result;
    }

    async createDate(payload) {
        const check = await this.find({"date": payload.date});
        if(check) {
            return null;
        }
        const date = await this.todo.insertOne({ "date": payload.date,
                                                 "todoList": []
                                                })
        return date;
    }

    async deleteDate(dateId) {
        const result = await this.todo.findOneAndDelete({"_id":  ObjectId.isValid(dateId) ? new ObjectId(dateId) : null})
        return result.value;
    }

    async updateDate(newDate, dateId) {
        const check = await this.find({"date": newDate})
        if(check) {
            return null;
        }
        const result = await this.todo.findOneAndUpdate(
            {"_id":  ObjectId.isValid(dateId) ? new ObjectId(dateId) : null},
            {$set: {"date": newDate}},
            {returnDocument: "after"}
        )
        return result;
    }

    // action
    formAction(payload) {
        const action = {
            "actionName": payload.actionName,
            "status": payload.status || false,
            "important": payload.important,
            "created_at": new Date(Date.now()),
            "done_at": "",
        }

        Object.keys(action).forEach((index) => {
            return action[index] === undefined && delete action[index];
        })

        return action;
    } 
    
    async createAction(dateId, todoId, payload) {
        const date = await this.find({"_id":  ObjectId.isValid(dateId) ? new ObjectId(dateId) : null})
        const action = this.formAction(payload);
        const result = this.todo.findOneAndUpdate(
            {"_id": date._id, "todoList.todoId": parseInt(todoId)},
            {$push: {'todoList.$.actionList': {...action, "actionId": date.todoList[todoId].actionList.length}}}
        )

        return result;
    }
    
    async updateAction(dateId, todoId, actionId, payload) {
        const date = await this.todo.findOne({"_id":  ObjectId.isValid(dateId) ? new ObjectId(dateId) : null});
        const actionNew = payload;
        const updateData = Object.entries(actionNew).reduce(    
            (previous, [key, value]) => {
                return Object.assign(previous, {[`todoList.$.actionList.${actionId}.${key}`]: value})
            },
            {[`todoList.$.actionList.${actionId}.done_at`]: actionNew.status == true? new Date(Date.now()) : ""}
        )
        const result = await this.todo.findOneAndUpdate(
            {"_id": date._id, "todoList.todoId": parseInt(todoId)},
            {$set: {
                    ...updateData,
                    }
            },
            {returnDocument: "after"}
        )

        return result
    }

    async deleteAction(dateId, todoId,actionId) {
        const result = await this.todo.findOneAndUpdate(
            {"_id":  ObjectId.isValid(dateId) ? new ObjectId(dateId) : null,
             "todoList.todoId": parseInt(todoId)
            },
            {$pull: {"todoList.$.actionList": { "actionId": parseInt(actionId) }}},
            {returnDocument: "after"}
        )

        return result
    }

    // todo
    formTodo(payload) {
        const todo = {
            "todoName": payload.todoName,
            "actionList": [], 
        }

        return todo;
    }

    async createToDo(dateId, payload) {
        const date = await this.find({"_id":  ObjectId.isValid(dateId) ? new ObjectId(dateId) : null})
        const todo = this.formTodo(payload);
        const checkIsExist = await this.find({"_id": date._id, "todoList.todoName": todo.todoName})
        if(checkIsExist) return false;
        const result = this.todo.findOneAndUpdate(
            date,
            {$push: {'todoList': {...todo, "todoId": date.todoList.length}}}
        )

        return result;
    }

    async changeNameTodo(dateId, todoId, payload) {
        const checkIsExist = await this.find({"_id": ObjectId.isValid(dateId) ? new ObjectId(dateId) : null, 
                                              "todoList.todoName": payload.todoName})
        if(checkIsExist) return false;
        const result = this.todo.findOneAndUpdate(
            {"_id": ObjectId.isValid(dateId) ? new ObjectId(dateId) : null, "todoList.todoId": parseInt(todoId)},
            {$set :{'todoList.$.todoName': payload.todoName}},
            {returnDocument: "after"}
        )

        return result;
    }

    async deleteToDo(dateId, todoId) {
        const result =  this.todo.findOneAndUpdate(
            {"_id": ObjectId.isValid(dateId) ? new ObjectId(dateId) : null},
            {$pull: {'todoList': {'todoId': parseInt(todoId)}}},
            {returnDocument: "after"}
        )

        return result;
    }
}

module.exports = ToDoServices