import React, { useRef, useState, useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ViewModel from "../model/ViewModel";
import LoadingScreen from "./LoadingScreen";
import MapOrder from "./MapOrder";
import { set } from "react-hook-form";

const Order = () => {
  const navigation = useNavigation();
  const interval = useRef(null);
  let user = null;
  const [menu, setMenu] = useState(null);
  const [order, setOrder] = useState(null);

  // Funzione per fetchare l'ordine
  const fetchOrder = async () => {
    console.log("Fetching order...");
    try {
      const updatedOrder = await ViewModel.getOrder(user.lastOid, user.sid);
      console.log("Updated Order:", updatedOrder);
      if (updatedOrder.status === "COMPLETED") {
        Alert.alert(
          "Ordine completato",
          "Il tuo ordine è stato consegnato con successo!",
          [{ text: "OK", onPress: () => navigation.navigate("Home") }]
        );
        clearInterval(interval.current); // Interrompi l'intervallo
        interval.current = null;
        console.log("User salvato:", user);
        const updatedUser = {
          ...user,
          lastOid: updatedOrder.oid,
          orderStatus: updatedOrder.status,
        };
        console.log("Updated User in fetch order:", updatedUser);
        user = updatedUser;
        ViewModel.user = updatedUser;
        ViewModel.storageManager.saveUserAsync(updatedUser).catch((error) => {
          console.error("Error saving user:", error);
        });
      }

      setOrder(updatedOrder);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  // Funzione per fetchare i dati iniziali
  const fetchDataFirst = async () => {
    try {
      const updatedUser = await ViewModel.storageManager.getUserAsync();
      console.log("Updated User:", updatedUser);
      user = updatedUser;
      ViewModel.user = updatedUser;
      let fetchedOrder = {
        oid: null,
        status: null,
      };
      if (updatedUser.lastOid) {
        fetchedOrder = await ViewModel.getOrder(
          updatedUser.lastOid,
          updatedUser.sid
        );
        const fetchedMenu = await ViewModel.getMenu(
          fetchedOrder.mid,
          updatedUser.sid
        );
        console.log("Fetched Order:", fetchedOrder);
        setMenu(fetchedMenu);

        await ViewModel.storageManager.saveUserAsync(updatedUser);
      }

      setOrder(fetchedOrder);

      return fetchedOrder;
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  // Esegui fetchDataFirst solo quando la schermata è focalizzata
  useFocusEffect(
    useCallback(() => {
      fetchDataFirst().then((fetchedOrder) => {
        console.log("Fetched Order:", fetchedOrder);
        if (fetchedOrder.status === "ON_DELIVERY") {
          interval.current = setInterval(() => {
            fetchOrder();
          }, 5000);
        }
      }); // Esegui i dati iniziali

      return () => {
        if (interval.current) {
          clearInterval(interval.current);
          interval.current = null;
          console.log("Smontata");
          ViewModel.storageManager.saveUserAsync(user).catch((error) => {
            console.error("Error saving user:", error);
          });
        }
      };
    }, [])
  );

  if (!order) {
    return <LoadingScreen />;
  }
  if (order && order.oid != null) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Dettagli Ordine</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{order.status || "N/A"}</Text>

          <Text style={styles.label}>Consegna:</Text>
          <Text style={styles.value}>
            {order.status === "ON_DELIVERY"
              ? order.expectedDeliveryTimestamp
              : "N/A"}
          </Text>

          <Text style={styles.label}>Quanto manca:</Text>
          <Text style={styles.value}>
            {order.status === "ON_DELIVERY"
              ? ViewModel.getTimeRemaining(order.expectedDeliveryTimestamp)
              : "N/A"}
          </Text>
        </View>
        <View style={styles.mapContainer}>
          
   {order?.deliveryLocation && order?.currentPosition && menu?.location ? (
    <MapOrder
      deliveryLocation={{
        latitude: order.deliveryLocation.lat,
        longitude: order.deliveryLocation.lng,
      }}
      dronePosition={{
        latitude: order.currentPosition.lat,
        longitude: order.currentPosition.lng,
      }}
      menuPosition={{
        latitude: menu.location.lat,
        longitude: menu.location.lng,
      }}
    />
  ) : (
    <Text>Caricamento dati della mappa...</Text>
  )} 
</View>

      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text>Schermata prima di aver effettuato un ordine</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 30,
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
});

export default Order;
