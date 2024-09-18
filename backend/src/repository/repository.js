const Restaurant = require("../model/restaurant");

const Repository = {
    findAll: async () => {
       return await Restaurant.find();
    },
    create: async (name,localization) => {
        return await Restaurant.create({
            name,
            localization
        });
    },
    findByName: async (name) => {
        return await Restaurant.findOne({name:name});
    },
    destroyByName: async (name) => {
        return await Restaurant.deleteOne({name:name})
    }
}

module.exports = Repository;