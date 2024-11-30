import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import ViewModel from "../model/ViewModel";

// Ottieni le dimensioni dello schermo per il design responsive
const { width } = Dimensions.get("window");

const Menu = ({ route }) => {
  // Ricevi l'oggetto "menu" passato tramite params
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
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
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
          Tempo di consegna: {longMenu.deliveryTime || "N/D"}
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
    color: "#ff7f50", // Colore arancione per il tempo di consegna
    fontWeight: "600",
  },
});

export default Menu;
