import React, { useRef, useState, useCallback } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ViewModel from "../model/ViewModel";
import LoadingScreen from "./LoadingScreen";
import MapOrder from "./MapOrder";
import { set } from "react-hook-form";

// Order è il componente che mostra i dettagli dell'ordine
const Order = () => {
  const navigation = useNavigation();
  // variabile per l'intervallo
  const interval = useRef(null); // Intervallo per il fetch dell'ordine
  let user = null;
  // variabili di stato per menu e ordine
  const [menu, setMenu] = useState(null);
  const [order, setOrder] = useState(null);

  // Funzione per fetchare l'ordine
  const fetchOrder = async () => {
    console.log("Fetching order...");
    try {
      // recupera l'ultimo ordine aggiornato
      const updatedOrder = await ViewModel.getOrder(user.lastOid, user.sid);
      console.log("Updated Order:", updatedOrder);
      // se lo status è COMPLETED, mostro un alert che dice che l'ordine è stato consegnato con successo
      if (updatedOrder.status === "COMPLETED") {
        Alert.alert(
          "Ordine completato",
          "Il tuo ordine è stato consegnato con successo!",
          // se premo OK, vado alla Home
          [{ text: "OK", onPress: () => navigation.navigate("Home", {screen: "Homepage"} ) }]
        );
        // Interrompi l'intervallo
        clearInterval(interval.current); // Interrompi l'intervallo
        interval.current = null;
        console.log("User salvato:", user);
        // modifico l'utente con l'ultimo ordine e lo status dell'ordine
        const updatedUser = {
          ...user,
          lastOid: updatedOrder.oid,
          orderStatus: updatedOrder.status,
        };
        console.log("Updated User in fetch order:", updatedUser);
        user = updatedUser;
        // salvo utente nel ViewModel
        ViewModel.user = updatedUser;
        // salvo l'utente in async storage
        ViewModel.storageManager.saveUserAsync(updatedUser).catch((error) => {
          console.error("Error saving user:", error);
        });
      }
      // setto l'ordine con l'ordine aggiornato
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  // Funzione per fetchare i dati iniziali
  const fetchDataFirst = async () => {
    try {
      // recupera l'utente da async storage
      const updatedUser = await ViewModel.storageManager.getUserAsync();
      console.log("Updated User:", updatedUser);
      // setta l'utente
      user = updatedUser;
      ViewModel.user = updatedUser;
      // variabile per l'ordine
      let fetchedOrder = {
        oid: null,
        status: null,
      };
      // se l'utente ha un ultimo ordine, recupera l'ordine e il menu
      if (updatedUser.lastOid) {
        // recupero l'ultimo ordine
        fetchedOrder = await ViewModel.getOrder(
          updatedUser.lastOid,
          updatedUser.sid
        );
        // recupero il menu
        const fetchedMenu = await ViewModel.getMenu(
          fetchedOrder.mid,
          updatedUser.sid
        );
        console.log("Fetched Order:", fetchedOrder);
        // setto il menu
        setMenu(fetchedMenu);
        // salvo l'utente in async storage
        await ViewModel.saveUserAsync(updatedUser);
      }
      // setto l'ordine
      setOrder(fetchedOrder);
      // ritorno l'ordine
      return fetchedOrder;
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  // Funzione per salvare la schermata visitata in async storage
  const savePage = async () => {
    await ViewModel.saveLastScreenAsync("Order");
  };

  // Esegui fetchDataFirst solo quando la schermata è focalizzata
  useFocusEffect(
    // callback per il fetch dei dati iniziali e l'intervallo
    useCallback(() => {
      // Salva la schermata visitata in async storage
      savePage();
      // Esegui il fetch dei dati iniziali
      fetchDataFirst().then((fetchedOrder) => {
        console.log("Fetched Order:", fetchedOrder);
        // Se lo status è ON_DELIVERY, esegui l'intervallo
        if (fetchedOrder.status === "ON_DELIVERY") {
          // settare l'intervallo, esegue fetchOrder ogni 5 secondi
          interval.current = setInterval(() => {
            fetchOrder();
          }, 5000);
        }
      }); // Esegui i dati iniziali

      // Funzione di cleanup
      return () => {
        // Se l'intervallo è attivo, interrompilo
        if (interval.current) {
          clearInterval(interval.current);
          interval.current = null;
          console.log("Smontata");
          // Salva l'utente in async storage
          ViewModel.storageManager.saveUserAsync(user).catch((error) => {
            console.error("Error saving user:", error);
          });
        }
      };
    }, [])
  );

  // Se non ho l'ordine, mostro il componente di caricamento
  if (!order) {
    return <LoadingScreen />;
  }
  // Se ho l'ordine, mostro i dettagli dell'ordine
  if (order && order.oid != null) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Dettagli Ordine</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Stato dell'ordine:</Text>
          <Text style={styles.value}>{
                order.status === "ON_DELIVERY" ? "In Consegna" :
                order.status === "COMPLETED" ? "Consegnato" :
                "Not provided"
              }</Text>

          <Text style={styles.label}>Consegna:</Text>
          <Text style={styles.value}>
            {order.status === "ON_DELIVERY"
              ? ViewModel.fromTimeStampToDayAndTime(order.expectedDeliveryTimestamp)
              : ViewModel.fromTimeStampToDayAndTime(order.deliveryTimestamp)}
          </Text>

          <Text style={styles.label}>Tempo rimanente:</Text>
          <Text style={styles.value}>
            {order.status === "ON_DELIVERY"
              ? ViewModel.getTimeRemaining(order.expectedDeliveryTimestamp)
              : "Ordine già consegnato"}
          </Text>
        </View>
        <View style={styles.mapContainer}>
          
   {order?.deliveryLocation && order?.currentPosition && menu?.location ? (
    // Se ho i dati della mappa, mostro la mappa
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
    // Se non ho i dati della mappa, mostro un messaggio
    <Text>Caricamento dati della mappa...</Text>
  )} 
</View>

      </View>
    );
  }
  // Se non ho l'ordine, mostro un messaggio (non è ancora stato effettuato un ordine)
  return (
    <View style={styles.containerNoOrder}>
      <Text style={styles.noOrderTitle}>Nessun ordine attivo</Text>
      <Text style={styles.noOrderText}>Non hai ancora effettuato un ordine, fallo ora!</Text>
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
  containerNoOrder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
   noOrderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noOrderText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
});

export default Order;
