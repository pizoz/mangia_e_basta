import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const MapOrder = ({ deliveryLocation, dronePosition, menuPosition }) => {
  // Stato per la regione della mappa
  // const latitudeDifference = Math.abs(menuPosition.latitude - deliveryLocation.latitude);
  // const longitudeDifference = Math.abs(menuPosition.longitude - deliveryLocation.longitude);
  
  const [region, setRegion] = useState({
    latitude: dronePosition.latitude,
    longitude: dronePosition.longitude,
    // latitudeDelta: latitudeDifference,
    // longitudeDelta: longitudeDifference,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Aggiorna la regione della mappa quando la posizione del drone cambia
  useEffect(() => {
    setRegion({
      latitude: dronePosition.latitude,
      longitude: dronePosition.longitude,
      // latitudeDelta: latitudeDifference,
      // longitudeDelta: longitudeDifference,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, [dronePosition]); // Esegui l'aggiornamento ogni volta che la posizione del drone cambia

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={false}
        region={region} // Usa la regione aggiornata
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)} // Opzionale: aggiorna la regione se l'utente muove la mappa
      >
        {dronePosition?.latitude !== deliveryLocation?.latitude ||
        dronePosition?.longitude !== deliveryLocation?.longitude ? (
          <Marker coordinate={dronePosition} title="Drone Position">
            <Image
              source={require("../assets/drone.png")}
              style={{ width: 30, height: 30 }}
              
            />
          </Marker>
        ) : null}

        <Marker coordinate={menuPosition} title={"Menu Position"} >
          <Image
            source={require("../assets/shopping.png")}
            style={{ width: 35, height: 35 }}
          />
        </Marker>

        <Marker coordinate={deliveryLocation} title={"Delivery Position"} >
          <Image
            source={require("../assets/home.png")}
            style={{ width: 35, height: 35 }}
          />
        </Marker>

        {/* Disegna una linea tra il menuPosition e il deliveryLocation */}
        <Polyline
          coordinates={[menuPosition, deliveryLocation]} // Le coordinate da connettere
          strokeColor="#FF6347" // Colore della linea (arancione)
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
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
    ...StyleSheet.absoluteFillObject,
  },
});
