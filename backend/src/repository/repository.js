const Restaurant = require("../model/restaurant");
const clientRedis = require('../database/redis');
const updateCache = async () => {
    await clientRedis.del('restaurants')
    const novoCache = await Restaurant.find()
    await clientRedis.set('restaurants', JSON.stringify(novoCache))
}


const Repository = {
    findAll: async () => {
        let restaurants = null;
        const cache = await clientRedis.get('restaurants');
        if(cache !== '[]'){
            console.log('Cache hit');
            restaurants = JSON.parse(cache);
        }
        else{
            console.log('Cache miss');

            restaurants = await Restaurant.find();
            await clientRedis.set('restaurants', JSON.stringify(restaurants));
        }
        return restaurants;
    },
    create: async (name,localization, description) => {
        const restaurant = await Restaurant.create({
            name,
            description,
            localization
        });
        await updateCache()
        return restaurant;
    },
    findByName: async (name) => {
        const cache = await clientRedis.get('restaurants')
        let restaurant = null;
        if(cache !== '[]'){
            const restaurants = JSON.parse(cache)
            restaurants.find((item) => {
                if(item.name === name){
                    restaurant = item; 
                }
            })
            
        }
        return restaurant;

        
    },
    destroyByName: async (name) => {
        const restaurant = await Restaurant.deleteOne({name:name})
        await updateCache()
        return restaurant;
    },
    destroyAll: async () => {
        const restaurants = await Restaurant.deleteMany({})
        await updateCache()
        return restaurants;
    },

    updateLocByName: async (name, loc) => {
        const result = await Restaurant.updateOne({ name:name }, { $set: { localization: loc } });
        if(result.modifiedCount === 0){
            return null
        }
        await updateCache();
        return result;
    },

    findByTextIndex: async (keyword) => {
        const result = await Restaurant.find({$text:{$search: keyword}}, 
            {score:{ $meta: "textScore" } }).sort({ score: { $meta: "textScore" } })
            return result;
    }   
}

module.exports = Repository;