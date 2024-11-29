import React from 'react'
import { View, Text, Button } from 'react-native'
import ViewModel from '../model/ViewModel';
import { useEffect } from 'react';
const Home = ({navigation}) => {
    useEffect(() => {
        // al caricamento della Homepage, traduco la posizione nella via in cui si trova l'utente
    },[])
    return (
        <View>
            <Text>Home</Text>
            <Button title="Reset" onPress={() => ViewModel.reset()}/>
        </View>
    )
}
export default Home;