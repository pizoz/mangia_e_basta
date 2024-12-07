import React from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import ViewModel from "../model/ViewModel";
import LoadingScreen from "./LoadingScreen";
import { useCallback } from "react";
const InfoProfile = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const res = await ViewModel.storageManager.getUserAsync();
          console.log(res);
          setUser(res);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      fetchUser();
    }, [])
  );

  if(user===null){
    return <LoadingScreen />;
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.decorativeHeader}>
        <Text style={styles.decorativeText}>👤</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <InfoItem label="First Name" value={user.firstName || "Not provided"} />
        <InfoItem label="Last Name" value={user.lastName || "Not provided"} />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <InfoItem
          label="Card Number"
          value={user.cardNumber || "Not provided"}
        />
        <InfoItem
          label="Card Holder"
          value={user.cardFullName || "Not provided"}
        />
        <InfoItem
          label="Expiration"
          value={
            user.cardExpireMonth && user.cardExpireYear
              ? `${user.cardExpireMonth}/${user.cardExpireYear}`
              : "Not provided"
          }
        />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        <InfoItem
          label="Last Order ID"
          value={user.lastOid || "No orders yet"}
        />
        <InfoItem label="Order Status" value={user.orderStatus || "N/A"} />
      </View>
      <Button
        title="Edit Profile"
        onPress={() =>
          navigation.navigate("Form", { user: user, before: "ProfilePage" })
        }
      />
    </ScrollView>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  decorativeHeader: {
    height: 150,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
  },
  decorativeText: {
    fontSize: 60,
  },
  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#4a90e2",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  infoContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});

export default InfoProfile;
