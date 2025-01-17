import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ViewModel from "../model/ViewModel";
import LoadingScreen from "./LoadingScreen";

// InfoProfile è il componente che mostra le informazioni dell'utente
const InfoProfile = () => {
  // variabili di stato per utente, ordine e menu
  const [user, setUser] = useState(ViewModel.user);
  const [order, setOrder] = useState(null);
  const [menu, setMenu] = useState(null);
  // variabili per la navigazione e l'animazione
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // per capire se la schermata è attiva, serve per fare il fetch dei dati

  // funzione per recuperare l'utente da async storage e i dettagli dell'ordine e del menu se esistono
  const fetchUser = async () => {
    try {
      // recupera l'utente da async storage
      const res = await ViewModel.storageManager.getUserAsync();
      console.log("res:  ", res);
      let order = null;
      let menu = null;
      // se l'utente ha un ordine, recupera l'ordine e il menu
      if (res.lastOid != null) {
        order = await ViewModel.getOrder(res.lastOid, res.sid);
        menu = await ViewModel.getMenu(order.mid, res.sid);
      }
      // setta le variabili di stato
      setUser(res);
      setMenu(menu);
      setOrder(order);
      
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // effetto per fare il fetch dell'utente quando la schermata è attiva
  useEffect(() => {
    fetchUser();
  }, [isFocused]);

  // se non ho l'utente, mostro il componente di caricamento
  if (!user) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#4a90e2", "#63a4ff"]} style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{"👤"}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <InfoSection title="Informazioni Personali">
          <InfoItem
            icon="person"
            label="Nome"
            value={user.firstName || "Sconosciuto"}
          />
          <InfoItem
            icon="people"
            label="Cognome"
            value={user.lastName || "Sconosciuto"}
          />
        </InfoSection>

        <InfoSection title="Informazioni di Pagamento">
          <InfoItem
            icon="card"
            label="Intestatario"
            value={user.cardFullName || "Sconosciuto"}
          />
          <InfoItem
            icon="card"
            label="Numero di carta"
            value={
              user.cardNumber
                ? `**** **** **** ${user.cardNumber.slice(-4)}`
                : "Sconosciuto"
            }
          />
          <InfoItem
            icon="calendar"
            label="Scadenza"
            value={
              user.cardExpireMonth && user.cardExpireYear
                ? `${user.cardExpireMonth
                    .toString()
                    .padStart(2, "0")}/${user.cardExpireYear
                    .toString()
                    .slice(-2)}`
                : "Sconosciuta"
            }
          />
        </InfoSection>
        {order && menu ? (
          <>
            <InfoSection title="Informazioni sull'Ordine">
              <InfoItem
                icon="restaurant"
                label="Ultimo Ordine"
                value={menu.name || "Nessun ordine"}
              />
              <InfoItem
                icon="information-circle"
                label="Stato dell'ordine"
                value={
                  order.status === "ON_DELIVERY"
                    ? "In Consegna"
                    : order.status === "COMPLETED"
                    ? "Consegnato"
                    : "Not provided"
                }
              />
            </InfoSection>
          </>
        ) : null}

        <TouchableOpacity
          style={styles.editButton}
          // naviga alla schermata di modifica del profilo
          onPress={() => navigation.navigate("Form", { before: "ProfilePage" })}
        >
          <Text style={styles.editButtonText}>Modifica il profilo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// componente InfoSection per raggruppare le informazioni
const InfoSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

// componente InfoItem per mostrare le informazioni
const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoItemLeft}>
      <Ionicons
        name={icon}
        size={24}
        color="#4a90e2"
        style={styles.infoItemIcon}
      />
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: 10,
    marginTop: 20,
  },
  avatarText: {
    fontSize: 40,
    color: "#ffffff",
    fontWeight: "bold",
  },
  headerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  infoItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoItemIcon: {
    marginRight: 10,
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
  editButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InfoProfile;
