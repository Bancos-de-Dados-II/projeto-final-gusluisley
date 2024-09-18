import { MapContainer, TileLayer, useMap, useMapEvents} from 'react-leaflet'
import { Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import './style.css'
import { useState } from 'react';
import L from 'leaflet';
import marker from '../../assets/marker.icon.jpg';
import { useRestaurantData } from '../../hooks/useRestaurantData';
import { useRestaurantDataMutate } from '../../hooks/useRestaurantDataMutate';


const myIcon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor:  [-0, -0],
    iconSize: [32,45],     
});



function Map() {
  const initialPosition = [-6.88817982014655, -38.55806053465703];
  const [markerPosition, setMarkerPosition] = useState(initialPosition)
  const [inputValue, setInputValue] = useState('')

  const {mutate} = useRestaurantDataMutate()
  const {data} = useRestaurantData()

  function GetAllRestaurantes() {
    console.log(data)
    return data?.map((restaurant) => (
      <Marker key={restaurant.id} position={restaurant.localization} icon={myIcon} />
    ))
  }
  
  function salvarRestaurante() {
    const name = inputValue;
    const localization = {
      type:"Point",
      coordinates: [markerPosition[0],markerPosition[1]]
    }
    const restaurantData = {
      name,
      localization
    }
    
    mutate(restaurantData)   
  }

  function updateInput (e){
    setInputValue(e.target.value)
  }
   function SetMarker() {
    const map = useMapEvents({
      click(e) {
        console.log('Disparou')
        const coordinates = e.latlng;
        setMarkerPosition(coordinates)
      },
    })
    return(
      <Marker position={markerPosition} icon={myIcon} >
        <Popup>You are here</Popup>
      </Marker>
    )
  }

    return (
      <>
        <MapContainer center={markerPosition} zoom={13} scrollWheelZoom={true} className='map-container' >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <GetAllRestaurantes/> */}
          <SetMarker/>
        </MapContainer>
        <input value={inputValue} onChange={updateInput} placeholder='Ex: Fast-Lanches'/>
        <button onClick={salvarRestaurante}>Salvar</button>
        <button onClick={GetAllRestaurantes}>Get</button>
      </>
    );
}

export default Map