import { MapContainer, TileLayer, useMap, useMapEvents} from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import './style.css'
import { useEffect, useState } from 'react';
import L from 'leaflet';
import marker from '../../assets/marcador.png';
import { useRestaurantData } from '../../hooks/useRestaurantData';
import { useRestaurantDataMutate } from '../../hooks/useRestaurantDataMutate';
// import axios from 'axios';
import { useRestaurantDeleteMutate } from '../../hooks/useRestaurantDeleteMutate';
// import { useSearchRestaurantData } from '../../hooks/useSearchRestaurantData';
import { fetchSearchResults } from '../../hooks/useSearchRestaurantData';
import { Link } from 'react-router-dom';

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
  const [searchResult, setSearchResult] = useState(null)
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
        
      <Marker key={restaurant.id} position={[restaurant.localization.coordinates[1],restaurant.localization.coordinates[0]]} icon={myIcon}>
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
    const data = await fetchSearchResults(textSearch)
    setSearchResult(data)
    return
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
      <div className='header'>
          <h1 className='title'>Food Finder</h1>  
          <Link className='btn' id='link' to="/charts">Charts</Link>
      </div>
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
          <input value={inputValue} onChange={updateInput} placeholder='Nome ' className='input'/>
          <input value = {descriptionValue} onChange={updateDescriptionInput} placeholder='Descrição / Ex: Pizzaria' className='input'/>
          <button className='btn' onClick={salvarRestaurante}>Salvar</button><br/>
          <input value = {textSearch} placeholder='Buscar / Ex: Pizza' onChange={updateSearchInput} className='input' id='busca'/>
          <button className='btn' onClick={buscaPorTexto}>Buscar</button>
        </div>
        <div className='div'>
          <ul className='lista'>
          <h4>Restaurantes cadastrados:</h4>
            {data?.map((item) => {
              return(
                <li key={item.id}>
                  {item.name}
                </li>
              )
            })}
          </ul>
          <ul className='lista'>
            <h4>Resultados da pesquisa:</h4>
            {searchResult?.map((item) => {
              return(
                <li key={item.id}>
                  {item.name}
                </li>
              )
            })}
          </ul>
        </div>
      </>
    );
}

export default Map