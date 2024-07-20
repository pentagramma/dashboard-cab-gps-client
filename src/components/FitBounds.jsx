import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

const FitBounds = ({ bounds }) => {
    const map = useMap();
    map.fitBounds(bounds);
    return null;
  };

  export default FitBounds;
  

// {/* <LoadScript googleMapsApiKey="AIzaSyBE3J5p9S6xy006V8yVE_6Fw49nExSlSxs">
//             <GoogleMap
//               mapContainerStyle={{ width: '100%', height: '100%' }}
//               zoom={10}
//               center={{
//                 lat: 
//                 // selectedTrip.drive_locations[0]?.start_location.lat || 0,
//                 -3.745,

//                  lng: 
//                 //  selectedTrip.drive_locations[0]?.start_location.long || 0 
//                 -38.523
//               }}
              
//             >
//               {selectedTrip.drive_locations.map((location, index) => (
//   <React.Fragment key={index}>
//     {location.start_location && (
//       <Marker
//         position={
//           // lat: location.start_location.lat,
//           // lng: location.start_location.long
//           markerPosition
//         }
//         icon={{
//           url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
//         }}
//       />
//     )}
//       {/* {location.end_location && (
//       // <Marker
//       //   position={{
//       //     lat: location.end_location.lat,
//       //     lng: location.end_location.long
//       //   }}
//       //   icon={{
//       //     url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
//       //   }}
//       // />

// //    )} */}
//   </React.Fragment>
// ))}
//             </GoogleMap>
//           </LoadScript> */}

