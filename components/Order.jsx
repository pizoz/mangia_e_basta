import React, { use } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import ViewModel from "../model/ViewModel";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";

const Order = () => {
  const [lastOid, setLastOid] = useState(ViewModel.lastOid);
  const  isFocused = useIsFocused();
  const [user, setUser] = useState(ViewModel.user);
  useEffect(() => {
    if (isFocused) {
      setUser(ViewModel.user);
      console.log("Order focused");
      setLastOid(ViewModel.lastOid);
    }
  }, [isFocused]);
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("Order focused");
  //     setLastOid(ViewModel.lastOid);
  //   },[isFocused]) 
  // );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Order</Text>
      <Text style={styles.text}>lastOid: {lastOid || "N/A"}</Text>
      <Text style={styles.text}>User: {user ? user.lastOid : "N/A"}</Text>
      <Text style={styles.text}>User: {user ? user.orderStatus : "N/A"}</Text>
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#000000",
  },
});
