import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

// MapOrder è il componente che mostra la mappa con la posizione del drone, del menu e della consegna
const MapOrder = ({ deliveryLocation, dronePosition, menuPosition }) => {
  // Stato per la regione della mappa, inizializzato con la posizione del drone
  const [region, setRegion] = useState({
    latitude: dronePosition.latitude,
    longitude: dronePosition.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Aggiorna la regione della mappa quando la posizione del drone cambia
  useEffect(() => {
    setRegion({
      latitude: dronePosition.latitude,
      longitude: dronePosition.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, [dronePosition]); // Esegui l'aggiornamento ogni volta che la posizione del drone cambia

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={false}
        zoomEnabled={true}
        region={region} // Usa la regione aggiornata
        
      >
        {/* Disegna un marker per la posizione del drone se la posizione del drone e della consegna sono diversi */}
        {dronePosition?.latitude !== deliveryLocation?.latitude ||
        dronePosition?.longitude !== deliveryLocation?.longitude ? (
          <Marker coordinate={dronePosition} title="Drone Position">
            <Image
              source={require("../assets/drone.png")}
              style={{ width: 30, height: 30 }}
              
            />
          </Marker>
        ) : null}

        {/* Disegna un marker per la posizione del menu se la posizione del drone e quella del meni sono diverse */}
        {dronePosition?.latitude !== menuPosition?.latitude || 
        dronePosition?.longitude !== menuPosition?.longitude ? (
          <Marker coordinate={menuPosition} title={"Menu Position"} >
          <Image
            source={require("../assets/shopping.png")}
            style={{ width: 35, height: 35 }}
          />
        </Marker> )
        : null}

        {/* Disegna un marker per la posizione della consegna */}
        <Marker coordinate={deliveryLocation} title={"Delivery Position"} >
          <Image
            source={require("../assets/home.png")}
            style={{ width: 35, height: 35 }}
          />
        </Marker>

        {/* Disegna una linea tra il menuPosition e il deliveryLocation */}
        <Polyline
          coordinates={[menuPosition, deliveryLocation]} // Le coordinate da connettere
          strokeColor="#0c27f2" // Colore della linea (blu)
          strokeWidth={3} // Spessore della linea
        />
      </MapView>
    </View>
  );
};

export default MapOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    borderWidth: 2,
    borderColor: "#4a90e2",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
    ...StyleSheet.absoluteFillObject, 
  },
});
