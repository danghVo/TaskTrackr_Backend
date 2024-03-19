const { ObjectId } = require("mongodb");

class UserService {
    constructor(client){
        this.client = client;
        this.user = this.client.db().collection("users");
    }

    formUserAccount(payload) {
        const account = {
            username: payload.username,
            password: payload.password
        }

        Object.keys(account).forEach((key) => {
            return account[key] === undefined && delete account[key]
        });

        return account;
    }

    async create(payload) {
        const account = this.formUserAccount(payload);
        const isExist = await this.user.findOne({"username": account.username});
        if(isExist) 
            return false;
        const result = await this.user.findOneAndUpdate(
            account,
            { $set: {collection: account.username}},
            {returnDocument: "after", upsert: true}
        );
        await this.client.db().createCollection(account.username);
        return result.value;
    }

    async find(filter) {
        const cursor = await this.user.find(filter);
        return cursor.toArray();
    }

    async check(payload) {
        const account = this.formUserAccount(payload);
        const result = await this.find({
            "username": account.username
        })
        if(result.length === 0){
            return false
        }
        if(result[0].password !== account.password)
            return false
        return true;
    }
}

module.exports = UserService