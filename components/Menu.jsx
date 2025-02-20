import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import ViewModel from "../model/ViewModel";
import LoadingScreen from "./LoadingScreen";
import { set } from "react-hook-form";

// Get screen dimensions for responsive design
const { width } = Dimensions.get("window");

// Menu è il componente che mostra i dettagli di un menu
const Menu = ({ route }) => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState(null);
  const [user, setUser] = useState(ViewModel.user);
  const [longMenu, setLongMenu] = useState(null);

  // funzione per salvare la schermata visitata in async storage e l'ultimo menu visitato
  const savePage = async () => {
    await ViewModel.saveLastScreenAsync("Menu");
  };

  // inizializza il menu
  useEffect(() => {
    if (menu) {
      // salva la schermata visitata in async storage e l'ultimo menu visitato
      savePage();
      console.log("\n Menu: ", menu.name);
      // recupera l'utente da async storage
      ViewModel.getUserFromAsyncStorage().then((result) => {
        console.log("User from async: ", result);
        setUser(result);
        ViewModel.user = result;
      }
      ).catch((error) => {
        console.error("Errore durante il caricamento dell'utente:", error);
      });

      console.log("User: ", user);
      ViewModel.lastMenu = menu;
      console.log("Menu VIewModel: ", ViewModel.lastMenu.name);
      // recupera i dettagli del menu con longDescription e immagine
      ViewModel.getMenuDetail(menu, user)
        .then((result) => {
          setLongMenu(result);
        })
        .catch((error) => {
          console.error("Errore durante il caricamento del menu:", error);
        });
    } else {
      // recupera l'ultimo menu visitato
      ViewModel.getLastMenu().then((result) => {
        setMenu(result);
      });
    }
  }, [menu]);

  // funzione per gestire il click sul button "Ordina"
  const onClickOnButton = () => {
    const user = ViewModel.user;
    console.log("Side: ", user.sid);
    // se l'utente non ha completato il profilo, mostro un alert
    if (!ViewModel.isValidUser(user)) {
      Alert.alert(
        "Profilo non completo!",
        "Completa il tuo profilo per poter ordinare e gustarti questo menu.",
        [
          {
            text: "Completa il profilo",
            onPress: () =>
              // naviga alla schermata Form dello stack Profile per completare il profilo
              navigation.navigate("Profile", {
                screen: "Form",
                params: { user: user, before: "CompletaProfilo" },
              }),
            isPreferred: true,
          },
        ],

        { cancelable: true }
      );
    } else {
      // naviga alla schermata ConfirmOrder
      navigation.navigate("ConfirmOrder");
    }
  };

  if (longMenu !== null && user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.navigate("Homepage")
            }
            }
          >
            <ArrowLeft color="#333" size={24} />
          </TouchableOpacity>
        </View>

        <Image
          source={{
            uri: longMenu.image || "https://via.placeholder.com/400x200",
          }}
          style={styles.menuImage}
        />
        <Text style={styles.title}>{longMenu.name}</Text>
        <Text style={styles.description}>{longMenu.longDescription}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.price}>
            Prezzo: {longMenu.price ? `${longMenu.price} €` : "N/D"}
          </Text>
          <Text style={styles.deliveryTime}>
            Tempo di consegna:{" "}
            {ViewModel.getDeliveryTime(longMenu.deliveryTime)}
          </Text>
          <Button style={styles.marginTopButton}  title={"Ordina"} onPress={onClickOnButton} />
        </View>
      </View>
    );
  }

  // se non ho il menu, mostro il componente di caricamento
  return <LoadingScreen />;
};

const styles = StyleSheet.create({
  marginTopButton: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 5,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
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
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default Menu;
