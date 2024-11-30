import React from "react";
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MenusList = ({ menus = [], user }) => {
    const navigation = useNavigation();

    const handleMenuDetails = (item) => {
        navigation.navigate("Menu", { menu: item, user: user });
    };
  return (
    <FlatList
      data={menus}
      keyExtractor={(item) => item.mid.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleMenuDetails(item)}>
          <View style={styles.cardContent}>
            {/* Testo a sinistra */}
            <View style={styles.textContainer}>
              <Text style={styles.menuTitle}>{item.name}</Text>
              <Text style={styles.menuDescription}>
                {item.shortDescription || "Descrizione non disponibile"}
              </Text>
              <Text style={styles.menuPrice}>
                Prezzo: {item.price ? `${item.price} €` : "N/D"}
              </Text>
            </View>
            {/* Immagine a destra */}
            <Image
              source={{
                uri: item.image || "https://via.placeholder.com/100",
              }}
              style={styles.menuImage}
            />
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.emptyMessage}>Nessun menu disponibile</Text>}
      showsVerticalScrollIndicator={true}
      ListFooterComponent={<View style={styles.footerSpace} />} // Aggiungi spazio extra alla fine
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
    flexDirection: "row", // Disposizione orizzontale
    alignItems: "center", // Allineamento verticale centrale
    justifyContent: "space-between", // Spazio tra testo e immagine
  },
  textContainer: {
    flex: 1, // Occupa lo spazio rimanente
    marginRight: 20, // Spazio tra il testo e l'immagine
    
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
    borderRadius: 10, // Angoli arrotondati per l'immagine
    backgroundColor: "#f0f0f0", // Colore di sfondo in caso di caricamento lento
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
  footerSpace: {
    height: 60, // Aggiunge spazio extra alla fine della lista
  },
});

export default MenusList;
