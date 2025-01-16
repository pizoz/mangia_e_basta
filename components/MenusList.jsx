import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import ViewModel from "../model/ViewModel";
import LoadingScreen from "./LoadingScreen";

// MenusList è il componente che mostra la lista dei menu
const MenusList = ({ menus = [], user, setChanged }) => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  
  // funzione per gestire il click su un menu, salva l'ultimo menu cliccato e naviga alla schermata Menu, passando il menu e l'utente
  const handleMenuDetails = (item) => {
    ViewModel.lastMenu = item;
    navigation.navigate("Menu", { menu: item, user: user });
  };

  // funzione per aggiornare la lista dei menu
  const onRefresh = async () => {
    // setto refreshing a true per mostrare il componente di caricamento
    setRefreshing(true);
    // recupero la posizione attuale
    await ViewModel.getLocation();
    // setto refreshing a false per nascondere il componente di caricamento
    setRefreshing(false);
    // setto changed a true per aggiornare la home
    setChanged((prev) => !prev);
  };

  // se non ho i menu, mostro il componente di caricamento
  if (menus === null ) {
    return (
      <LoadingScreen />
    )
  }

  // mostro la lista dei menu
  return (
    <FlatList
      data={menus}
      keyExtractor={(item) => item.mid.toString()}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleMenuDetails(item)}
        >
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={styles.menuTitle}>{item.name}</Text>
              <Text style={styles.menuDescription}>
                {item.shortDescription || "Descrizione non disponibile"}
              </Text>
              <Text style={styles.menuPrice}>
                Prezzo: {item.price ? `${item.price} €` : "N/D"}
              </Text>
            </View>
            <Image
              source={{
                uri: item.image || "https://via.placeholder.com/100",
              }}
              style={styles.menuImage}
            />
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyMessage}>Nessun menu disponibile</Text>
      }
      showsVerticalScrollIndicator={true}
      ListFooterComponent={<View style={styles.footerSpace} />}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
  footerSpace: {
    height: 60,
  },
});

export default MenusList;
