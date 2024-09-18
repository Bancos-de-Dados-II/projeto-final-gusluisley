const { StatusCodes } = require('http-status-codes');
const Repository = require('../repository/repository');

const findAll = async (req, res) => {
    try{
        const restaurants = await Repository.findAll();
        res.status(StatusCodes.OK).json(restaurants);
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err
        })
    }
}

const addRestaurant = async (req, res) => {
    try{
        const { name, localization } = req.body
        const result = await Repository.create(name, localization)
        res.status(StatusCodes.CREATED).json(result);
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err
        })
    }
} 

const removeRestaurantByName = async (req, res) => {
    try{
        const name = req.params.name;
        let restaurant;
        if(restaurant = await Repository.findByName(name)){
            await Repository.destroyByName(name);
            res.status(StatusCodes.OK).json(restaurant);
        }
        else{
            res.status(StatusCodes.NOT_FOUND).json({
                message: "Restaurante nao encontrado!"
            })
        }        
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err
        })
    }
}

const findByName = async (req, res) => {
    try{
        const name = req.params.name;
        const restaurant = await Repository.findByName(name);
        res.status(StatusCodes.OK).json(restaurant);
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err
        })
    }
}

const updateLocalization = async (req, res) => {
    try{
        const newLoc = req.body;
        let restaurant;
        const name = req.params.name;
        if(restaurant = await Repository.findByName({name})){
            result.localization = newLoc;
            await result.save();
            res.status(StatusCodes.CREATED).json(restaurant);
        }
        else{
            res.status(StatusCodes.NOT_FOUND).json("Restaurante não encontrado");
        }
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err
        })
    }
}

module.exports = {findAll, addRestaurant, removeRestaurantByName, findByName, updateLocalization}
