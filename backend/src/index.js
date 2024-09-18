const express = require('express')
const cors = require('cors')
require ('dotenv').config()
const { findAll, addRestaurant, removeRestaurantByName, findByName, updateLocalization } = require('./controller/controller');

const port = process.env.API_PORT;
const app = express();

app.use(express.json());
app.use(cors({
    origin:'*'
}))

app.get("/", (req,res) => {
    res.send("AQUI ACABOU!");
})

app.get('/restaurants', findAll)
app.get('/:name', findByName)
app.post('/', addRestaurant)
app.delete('/:name', removeRestaurantByName)
app.patch('/:name', updateLocalization)

app.listen(port, () => {
    console.log(`Rodando no host:http://localhost:${port}`)
})