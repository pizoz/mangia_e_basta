import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import ViewModel from "../model/ViewModel";
import LoadingScreen from "./LoadingScreen";

// Get screen dimensions for responsive design
const { width } = Dimensions.get("window");

const Menu = ({ route }) => {
  const navigation = useNavigation();
  const { menu, user } = route.params;
  const [longMenu, setLongMenu] = useState(null);

  useEffect(() => {
    if (menu && user) {
      console.log("\n User : ", user);
      console.log("\n User.sid: ", user.sid);

      ViewModel.getMenuDetail(menu, user)
        .then((result) => {
          setLongMenu(result);
        })
        .catch((error) => {
          console.error("Errore durante il caricamento del menu:", error);
        });
    }
  }, [menu, user]);

  if (longMenu === null) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft color="#333" size={24} />
      </TouchableOpacity>
      
      </View>
      
      <Image
        source={{ uri: longMenu.image || "https://via.placeholder.com/400x200" }}
        style={styles.menuImage}
      />
      <Text style={styles.title}>{longMenu.name}</Text>
      <Text style={styles.description}>{longMenu.longDescription}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.price}>
          Prezzo: {longMenu.price ? `${longMenu.price} €` : "N/D"}
        </Text>
        <Text style={styles.deliveryTime}>
          Tempo di consegna: {longMenu.deliveryTime === null ? "N/D" : longMenu.deliveryTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 5,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  menuImage: {
    width: width - 32,
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    marginTop: 48, // Add some top margin to accommodate the back button
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  detailsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  price: {
    fontSize: 18,
    color: "#007BFF",
    fontWeight: "bold",
    marginBottom: 8,
  },
  deliveryTime: {
    fontSize: 16,
    color: "#ff7f50",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default Menu;

