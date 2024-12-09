import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import ViewModel from '../model/ViewModel';
import LoadingScreen from './LoadingScreen';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const Order = () => {
  const navigation = useNavigation();
  const interval = useRef(null);
  const isFocused = useIsFocused();
  const [user, setUser] = useState(ViewModel.user);
  const [menu, setMenu] = useState(null);
  const [order, setOrder] = useState(null);
  const [onDelivery, setOnDelivery] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const user = await ViewModel.storageManager.getUserAsync();
      const updatedOrder = await ViewModel.getOrder(user.lastOid, user.sid);
      console.log(updatedOrder);
      if (updatedOrder.status === "COMPLETED") {
        Alert.alert(
          'Ordine completato',
          'Il tuo ordine è stato consegnato con successo!',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        )
        if (interval.current) {
          clearInterval(interval.current);
          interval.current = null;
        }
        const newUser = {
          ...user,
          lastOid: updatedOrder.oid,
          orderStatus: updatedOrder.status,
        };
        console.log(newUser);
        await ViewModel.saveUserAsync(newUser);
        setOnDelivery(false);
      }
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [user, onDelivery]);

  const fetchDataFirst = useCallback(async () => {
    try {
      const updatedUser = await ViewModel.storageManager.getUserAsync();
      console.log("Updated User: ",updatedUser);
      setUser(updatedUser);
      if (updatedUser.lastOid == null) {
        return;
      }
      const fetchedOrder = await ViewModel.getOrder(updatedUser.lastOid, updatedUser.sid);
      setOrder(fetchedOrder);
      const fetchedMenu = await ViewModel.getMenu(fetchedOrder.mid, updatedUser.sid);
      setMenu(fetchedMenu);
      if (fetchedOrder.status === "ON_DELIVERY") {
        interval.current = setInterval(() => {
          fetchOrder();
        }, 5000);
      }
      setOnDelivery(fetchedOrder.status === "ON_DELIVERY");
      const newUser = {
        ...updatedUser,
        lastOid: fetchedOrder.oid,
        orderStatus: fetchedOrder.status,
      };
      await ViewModel.storageManager.saveUserAsync(newUser);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [fetchOrder]);

  useFocusEffect(
    useCallback(() => {
      fetchDataFirst().catch((error) => {
        console.error("Error fetching data:", error);
      });
      return () => {
        if (interval.current) {
          console.log("Component unmounted");
          clearInterval(interval.current);
          interval.current = null;
        }
      };
    }, [])
  );

  if (user == null || order == null) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Dettagli Ordine</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
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

export default Order;

