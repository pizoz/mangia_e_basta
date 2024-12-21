import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ViewModel from '../model/ViewModel';
import LoadingScreen from './LoadingScreen';

const InfoProfile = () => {
  const [user, setUser] = useState(ViewModel.user);
  const [order, setOrder] = useState(null);
  const [menu, setMenu] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [fadeAnim] = useState(new Animated.Value(0));

  const fetchUser = async () => {
    try {
      const res = await ViewModel.storageManager.getUserAsync();
      console.log(res);
      let order = null;
      let menu = null;
      if (res.lastOid != null) {
        order = await ViewModel.getOrder(res.lastOid, res.sid);
        menu = await ViewModel.getMenu(order.mid, res.sid);
      }
      setUser(res);
      setMenu(menu);
      setOrder(order);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [isFocused]);

  if (user === null) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4a90e2', '#63a4ff']}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{'👤'}</Text>
        </View>
      </LinearGradient>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <InfoSection title="Personal Information">
          <InfoItem icon="person" label="First Name" value={user.firstName || "Not provided"} />
          <InfoItem icon="people" label="Last Name" value={user.lastName || "Not provided"} />
        </InfoSection>

        <InfoSection title="Payment Information">
          <InfoItem icon="card" label="Card Holder" value={user.cardFullName || "Not provided"} />
          <InfoItem icon="card" label="Card Number" value={user.cardNumber ? `**** **** **** ${user.cardNumber.slice(-4)}` : "Not provided"} />
          <InfoItem 
            icon="calendar" 
            label="Expiration" 
            value={
              user.cardExpireMonth && user.cardExpireYear
                ? `${user.cardExpireMonth.toString().padStart(2, '0')}/${user.cardExpireYear.toString().slice(-2)}`
                : "Not provided"
            } 
          />
        </InfoSection>

        <InfoSection title="Order Information">
          {order && menu ? (
            <>
              <InfoItem icon="restaurant" label="Last Meal" value={menu.name || "No orders yet"} />
              <InfoItem icon="information-circle" label="Order Status" value={order.status || "N/A"} />
            </>
          ) : (
            <InfoItem icon="restaurant" label="Last Meal" value="No orders yet" />
          )}
        </InfoSection>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("Form", { user: user, before: "ProfilePage" })}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const InfoSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoItemLeft}>
      <Ionicons name={icon} size={24} color="#4a90e2" style={styles.infoItemIcon} />
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItemIcon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InfoProfile;
