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
  const [lastOid, setLastOid] = useState(ViewModel.lastOid);
  const  isFocused = useIsFocused();
  //const [user, setUser] = useState(ViewModel.user);
  const [lastOrder, setLastOrder] = useState(null);
  
  // const fetchUser = async () => {
  //   try {
  //     const res = await ViewModel.storageManager.getUserAsync();
  //     console.log(res);
  //     setUser(res);
  //     setLastOid(res.lastOid);
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //   }
  // };

  const fetchLastOrder = async () => {
    try {
      const res = await ViewModel.storageManager.getLastOrderAsync();
      console.log(res);
      setLastOrder(res);

    } catch (error) {
      console.error("Error fetching last order:", error);
    }
  };

  useEffect(() => {
    //fetchUser();
    fetchLastOrder();
  }, [isFocused]);

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("Order focused");
  //     setLastOid(ViewModel.lastOid);
  //   },[isFocused]) 
  // );

  if (!lastOrder) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Dettagli Ordine</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Menu:</Text>
        <Text style={styles.value}>{lastOrder.menuName || "N/A"}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{lastOrder.status || "N/A"}</Text>

        <Text style={styles.label}>Tempo di consegna stimato:</Text>
        <Text style={styles.value}>{lastOrder.expectedDeliveryTimestamp || "N/A"}</Text>

      </View>
    </View>
  );
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
