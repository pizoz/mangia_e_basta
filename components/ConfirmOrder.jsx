import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import ViewModel from "../model/ViewModel";
import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";

// ConfirmOrder è il componente che mostra i dettagli dell'ordine e permette di confermarlo
const ConfirmOrder = ({ navigation }) => {
  const [lastMenu, setLastMenu] = useState(null);
  const user = ViewModel.user;
  const locationCoords = ViewModel.getLocationCoords();

  const [address, setAddress] = useState(null);

  // funzione per recuperare l'indirizzo dell'utente e l'ultimo menu visitato da async storage e ViewModel 
  const fetchData = async () => {
    // salva la schermata visitata in async storage
    await ViewModel.saveLastScreenAsync("ConfirmOrder");
    // recupera l'indirizzo dell'utente 
    const address = await ViewModel.getAddress(locationCoords);
    setAddress(address.formattedAddress);
    // recupera utente da async storage
    const utente = await ViewModel.getUserFromAsyncStorage();
    // recupera l'ultimo menu visitato
    setLastMenu(await ViewModel.getLastMenu());

    ViewModel.user = utente;
  };

  // inizializza il componente con l'ultimo menu e l'indirizzo dell'utente
  useEffect(() => {
    fetchData();
  }, []);

  // funzione per confermare l'ordine
  const handleConfirmOrder = async () => {
    // chiamo la funzione confirmOrder di ViewModel per confermare l'ordine
    try {
      const order = await ViewModel.confirmOrder(
        lastMenu,
        user,
        locationCoords
      );
      // se l'ordine è undefined, non faccio nulla
      if (order === undefined) {
        return;
      }
      console.log("Order confirmed");
      navigation.navigate("Order");
    } catch (error) {
      // se c'è un errore, mostro un alert
      console.log("ERRORE", error);
      // se lo status è 409, mostro un alert che dice che non puoi ordinare per ora perchè hai già un ordine attivo
      if (error.status === 409) {
        Alert.alert(
          "Non puoi ordinare per ora, hai già un ordine attivo!",
          "",
          [
            {
              text: "OK",
            },
          ],
          { cancelable: true }
        );
      } else {
        // altrimenti, mostro un alert che dice che la carta non è valida
        Alert.alert(
          "Carta non valida!",
          "",
          [
            {
              text: "OK",
            },
          ],
          { cancelable: true }
        );
      }
    }
  };

  // se non ho l'utente o l'ultimo menu, mostro il componente di caricamento
  if (!user || !lastMenu) {
    console.log("User: ", user);
    console.log("LastMenu: ", lastMenu);
    return <LoadingScreen />;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Your Order</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>👤 User:</Text>
          <Text style={styles.value}>
            {user.firstName} {user.lastName}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>🍽️ Menu:</Text>
          <Text style={styles.value}>{lastMenu.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>📍 Posizione:</Text>
          <Text style={styles.value}>{address}</Text>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
        // se premo il button "Cancella", navigo alla schermata Menu
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.navigate("Menu")}
        >
          <Text style={styles.buttonText}> Cancella</Text>
        </TouchableOpacity>
        <TouchableOpacity
        // se premo il button "Conferma l'Ordine", chiamo la funzione handleConfirmOrder
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.buttonText}> Conferma l'Ordine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
    textAlign: "right",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
