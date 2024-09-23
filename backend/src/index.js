const express = require('express')
const cors = require('cors')
require ('dotenv').config()
const { dropAll, findAll, addRestaurant, removeRestaurantByName, findByName, updateLocalization, findByKeyword } = require('./controller/controller');
const { uuid } = require('uuidv4');

const port = process.env.API_PORT;
const app = express();

app.use(express.json());
app.use(cors({
    origin:'*'
}))

app.get("/", (req,res) => {
    console.log(uuid());
    res.send("AQUI ACABOU!");
})

app.get('/restaurants', findAll)
app.get('/restaurants/:name', findByName)
app.post('/restaurants', addRestaurant)
app.delete('/restaurants/:name', removeRestaurantByName)
app.delete('/restaurants', dropAll)
app.patch('/:name', updateLocalization)
app.get('/restaurants/busca/:keyword', findByKeyword)

app.listen(port, () => {
    console.log(`Rodando no host:http://localhost:${port}`)
})