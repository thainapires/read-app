import React, {useEffect, useState} from "react";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { FaPhone, FaFacebook, FaInstagram, FaLink } from "react-icons/fa";
import api from '../services/api';
import { useParams } from 'react-router-dom'

import '../styles/pages/library.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";

interface Library {
  latitude: number;
  longitude: number;
  name: string;
  about: string;
  phone: string;
  website: string;
  facebook: string;
  instagram: string;
  opening_hours: string;
  open_on_weekends: string;
  images: Array<{
    id: number;
    url: string;
  }>;
}

interface LibraryParams {
  id: string;
}


export default function Library() {
  const params = useParams<LibraryParams>();
  const [library, setLibrary] = useState<Library>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
      api.get(`libraries/${params.id}`).then(response => {
          setLibrary(response.data);
      })
  }, [params.id]);

  if(!library){
    return <p> Carregando... </p>;
  }

  return (
    <div id="page-library">
      
      <Sidebar />
      <main>
        <div className="library-details">
          <img src={library.images[activeImageIndex].url} alt={library.name} />

          <div className="images">
            {library.images.map((image, index) => {
              return (
                <button 
                key={image.id} 
                className={activeImageIndex === index ? 'active' : ''}
                type="button"
                onClick={() => {
                  setActiveImageIndex(index)
                }}>
                  <img src={image.url} alt={library.name} />
                </button>
              );
            })}
          </div>
          
          <div className="library-details-content">
            <h1>{library.name}</h1>
            <p>{library.about}</p>

            <div className="map-container">
              <Map 
                center={[library.latitude,library.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={mapIcon} position={[library.latitude,library.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${library.latitude},${library.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Mais informações</h2>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {library.opening_hours}
              </div>
              { library.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
              ):(
                <div className="open-on-weekends dont-open">
                <FiInfo size={32} color="#FF669D" />
                Não atendemos <br />
                fim de semana
              </div>
              ) }
            </div>

            <div className="contact-button phone">
              <FaPhone size={20} color="#FFF" />
              Telefone: {library.phone}
            </div>

            <div className="grid-container-links">
            <a href={`${library.website}`} type="button" className="contact-button site border-circle">
              <FaLink size={20} color="#FFF" className="fa-icons"/>
            </a>

            <a href={`${library.facebook}`} type="button" className="contact-button facebook border-circle">
              <FaFacebook size={20} color="#FFF" className="fa-icons"/>
            </a>

            <a href={`${library.instagram}`} type="button" className="contact-button instagram border-circle">
              <FaInstagram size={20} color="#FFF" className="fa-icons"/>
            </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}