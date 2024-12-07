import React, { use } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import ViewModel from "../model/ViewModel";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const Order = () => {
  const [lastOid, setLastOid] = useState(ViewModel.lastOid);

  useFocusEffect(
    useCallback(() => {
      setLastOid(ViewModel.lastOid);
    }, [ViewModel.lastOid]) 
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Order</Text>
      <Text style={styles.text}>lastOid: {lastOid || "N/A"}</Text>
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
