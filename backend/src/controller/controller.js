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

const dropAll = async (req, res) => {
    try{
        await Repository.destroyAll();
        res.status(StatusCodes.OK).json('Banco resetado com sucesso')
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err
        })
    }
}

const addRestaurant = async (req, res) => {
    try{
        if(req.body.localization.coordinates.lat!==null){
            const arrayBody = [req.body.localization.coordinates.lng, req.body.localization.coordinates.lat]
            req.body.localization.coordinates = arrayBody;
        }
        const { name, localization, description } = req.body
        const result = await Repository.create(name, localization, description)
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
        if(restaurant === null){
            res.status(StatusCodes.NOT_FOUND).json("Não foi possível encontrar o restaurante.")
        }
        else{
            res.status(StatusCodes.OK).json(restaurant);
        }
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
        const name = req.params.name;
        let restaurant = await Repository.updateLocByName(name, newLoc)
        if(restaurant !== null){
            res.status(StatusCodes.CREATED).json(`Localização de ${name} atualizado com sucesso!`);
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

const findByKeyword = async (req, res) => {
    const keyword = req.params.keyword
    try{
        const result = await Repository.findByTextIndex(keyword);
        if(result.length>0){
            res.status(StatusCodes.OK).json(result);
        }
        else{
            res.status(StatusCodes.NOT_FOUND).json("Desculpe, não encontrei nenhum restaurante com sua busca!");
        }
    }
    catch(err){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: err
            })
    }
    
    
}

module.exports = {findByKeyword, dropAll, findAll, addRestaurant, removeRestaurantByName, findByName, updateLocalization}
