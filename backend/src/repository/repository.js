const Restaurant = require("../model/restaurant");
const clientRedis = require('../database/redis');

const Repository = {
    findAll: async () => {
        let restaurants;
        const cache = await client.get('restaurants');
        if(cache){
            console.log('Cache hit');
            restaurants = JSON.parse(cache);
        }
        else{
            console.log('Cache miss');

            restaurants = await Restaurant.find();

            await client.set('restaurants', JSON.stringify(restaurants));
        }
        return restaurants;
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