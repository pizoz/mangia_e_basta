import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import ViewModel from "../model/ViewModel";
import { useState, useEffect } from "react";

const ConfirmOrder = ({ navigation }) => {
  const lastMenu = ViewModel.getLastMenu();
  const user = ViewModel.user;
  const locationCoords = ViewModel.getLocationCoords();

  const [address, setAddress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const address = await ViewModel.getAddress(locationCoords);
      setAddress(address.formattedAddress);
      const utente = await ViewModel.getUserFromAsyncStorage();
      ViewModel.user = utente;
    };
    fetchData();
  }, []);

  const handleConfirmOrder = async () => {
    try {
      //const lastOrder = await ViewModel.getOrder(user.lastOid, user.sid);
      //if (lastOrder.status === "COMPLETED") {
        const order = await ViewModel.confirmOrder(
          lastMenu,
          user,
          locationCoords
        );
        if (order === undefined) {
          return;
        }
        console.log("Order confirmed");
        navigation.navigate("Order");
      //}
    } catch (error) {
      console.log("ERRORE", error);
      if (error.status === 409) {
        Alert.alert(
          "Non puoi ordinare per ora, hai già un ordine attivo!",
          "",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: true }
        );
      }
    }
  };

  // if (!address) {
  //   return <LoadingScreen />;
  // }

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
          <Text style={styles.label}>📍 Location:</Text>
          <Text style={styles.value}>{address}</Text>
        </View>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.buttonText}>✅ Confirm My Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>❌ Cancel</Text>
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
