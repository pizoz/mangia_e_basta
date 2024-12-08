import React, { use } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import ViewModel from "../model/ViewModel";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { set } from "react-hook-form";
import LoadingScreen from "./LoadingScreen";

const Order = () => {
  const isFocused = useIsFocused();
  const [user, setUser] = useState(ViewModel.user);
  const [order, setOrder] = useState(null);

  const fetchDataFirst = async () => {
    try {
      const res = await ViewModel.storageManager.getUserAsync();
      console.log(res);
      setUser(res);

      const res2 = await ViewModel.getOrder(user.lastOid, user.sid);
      console.log(res2);
      setOrder(res2);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchOrder = async () => {
    try {
      const res = await ViewModel.getOrder(user.lastOid, user.sid);
      console.log(res);
      setOrder(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // UseEffect per fare la fetch iniziale e ogni 5 secondi se la schermata è in focus
  useEffect(() => {
    // Chiamata iniziale
    fetchDataFirst();

    // Funzione per aggiornare ogni 5 secondi
    const intervalId = setInterval(() => {
      if (isFocused) {
        fetchOrder();
      }
    }, 5000); // 5000ms = 5 secondi

    // Pulisci l'intervallo quando lo schermo non è più in primo piano
    return () => clearInterval(intervalId);
  }, [isFocused]); // Ricorsivo solo se la schermata è in focus

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("Order focused");
  //     setLastOid(ViewModel.lastOid);
  //   },[isFocused])
  // );

  if (order && user) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Dettagli Ordine</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Menu:</Text>
          <Text style={styles.value}>{user.orderName || "N/A"}</Text>

          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{user.orderStatus || "N/A"}</Text>

          <Text style={styles.label}>Consegna:</Text>
          <Text style={styles.value}>
            {order.expectedDeliveryTimestamp || "N/A"}
          </Text>

          <Text style={styles.label}>quanto manca:</Text>
          <Text style={styles.value}>
            {ViewModel.getTimeRemaining(order.expectedDeliveryTimestamp) || "N/A"}
          </Text>

        </View>
      </View>
    );
  }
  return <LoadingScreen />;
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4", // Sfondo chiaro
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#888",
    marginTop: 10,
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
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
});
