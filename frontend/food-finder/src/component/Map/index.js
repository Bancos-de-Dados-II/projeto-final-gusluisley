import { MapContainer, TileLayer, useMap, useMapEvents} from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import './style.css'
import { useEffect, useState } from 'react';
import L from 'leaflet';
import marker from '../../assets/marcador.png';
import { useRestaurantData } from '../../hooks/useRestaurantData';
import { useRestaurantDataMutate } from '../../hooks/useRestaurantDataMutate';
import axios from 'axios';
import { useRestaurantDeleteMutate } from '../../hooks/useRestaurantDeleteMutate';
import { useTextSearchData } from '../../hooks/useTextSearchData';


const myIcon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor:  [-0, -0],
    iconSize: [32,45],     
});
function MapContext(){
  const [initialPosition, setPosition] = useState([0,0]);
  const map = useMap();
  useEffect(() => {
      map.locate()
      map.on('locationfound', (e) => {
        console.log(e.latlng)
        const {lat, lng} = e.latlng
        map.setView([lat, lng])
      });
  }, [map]); // Executa sempre que o mapa for inicializado
}


function Map() {
  const initialPosition = [-6.88817982014655, -38.55806053465703];
  const [markerPosition, setMarkerPosition] = useState([0,0])
  const [textSearch, setTextSearch] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const [marcadorSelecionado, setMarcadorSelecionado] = useState(null);
  const {mutate} = useRestaurantDataMutate()
  const deleteMutate = useRestaurantDeleteMutate().mutate
  const {data} = useRestaurantData()



  function GetAllRestaurantes() {
    console.log(data)
    return data?.map((restaurant) => {
      
      return (
        
      <Marker key={restaurant.id} position={restaurant.localization.coordinates} icon={myIcon}>
        <Popup>{restaurant.name}<br/>{restaurant.description} <br/> 
        <button onClick={async () => {await deleteRestaurant(restaurant.name)}}>Deletar</button></Popup>
      </Marker>
      )
  })
  }
  
  function salvarRestaurante() {
    const name = inputValue;
    const description = descriptionValue;
    const localization = {
      type:"Point",
      coordinates: markerPosition
    }
    const restaurantData = {
      name,
      description,
      localization
    }
    mutate(restaurantData)   
  }
  
  async function deleteRestaurant (name){
    const retorno = deleteMutate(name)
  }

  function updateInput (e){
    setInputValue(e.target.value)
  }
  function updateDescriptionInput (e){
    setDescriptionValue(e.target.value)
  }
  function updateSearchInput (e){
    setTextSearch(e.target.value)
  }

  async function buscaPorTexto(e){
    const dataBusca = await axios.get('http://localhost:4000/restaurants/buscar/'+textSearch)
    return(
      <ul className='lista'>
       {dataBusca?.map((item) => {
              return(
                <li key={item.id}>
                  {item.name}
                </li>
              )
            })}
    </ul>)
    
   
  }
  
  function SetMarker() {
    const map = useMapEvents({
      click(e) {
        const coordinates = e.latlng;
        setMarkerPosition(coordinates)
      },
    })
    return(
      <Marker key={5} position={markerPosition} icon={myIcon}/>
    )
  }

    return (
      <>
      <h1>Food Finder</h1>
        <MapContainer center={markerPosition} zoom={14} scrollWheelZoom={true} className='map-container' >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GetAllRestaurantes/>
          
          <SetMarker/>
          <MapContext/>
        </MapContainer>
        <div className='form'>
          <input value={inputValue} onChange={updateInput} placeholder='Ex: Fast-Lanches' className='input'/>
          <button className='btn' onClick={salvarRestaurante}>Salvar</button><br/>
          <input value = {descriptionValue} onChange={updateDescriptionInput} placeholder='Ex: Fastfood' className='input'/>
          <input value = {textSearch} placeholder='Ex: Pizzaria' onChange={updateSearchInput} className='input'/>
          <button className='btn' onClick={buscaPorTexto}>Buscar</button>
        </div>
        <div className='div'>
          <ul className='lista'>
            {data?.map((item) => {
              return(
                <li key={item.id}>
                  {item.name}
                </li>
              )
            })}
          </ul>
          <buscaPorTexto/>
        </div>
      </>
    );
}

export default Map