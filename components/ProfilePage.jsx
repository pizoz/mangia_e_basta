import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import InfoProfile from './InfoProfile';
import LoadingScreen from './LoadingScreen';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
const ProfilePage = ({ navigation, route}) => {
  const { user, screen } = route.params;
  const [stateScreen, setStateScreen] = useState(screen);
  
  const onClickOnButton = (screen) => {
    if (screen === 'Form') {
      setStateScreen('Info');
    } else if (screen === 'FormOrder') {
      navigation.navigate('Home', {screen: 'ConfirmOrder'});
    }
  };  

  if (stateScreen === 'Info') {
    return (
      <InfoProfile user={user} setStateScreen={setStateScreen}/>
    );
  }
  if (stateScreen == 'Form' || stateScreen == 'FormOrder') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
        </View>
        <Text>Form</Text>
        <Button title="Save Profile" onPress={() => onClickOnButton(screen)} />
      </View>
    );
  }
  return (
    <LoadingScreen />
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  decorativeHeader: {
    height: 150,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeText: {
    fontSize: 60,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#4a90e2',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
});

export default ProfilePage;
