import React from 'react'
import { View, Text, Button } from 'react-native'
import ViewModel from '../model/ViewModel';

// import Menu from './Menu'

import { useEffect } from 'react';

const Home = ({navigation, route}) => {
    
    useEffect(() => {
        console.log(route.params.user)
        // al caricamento della Homepage, traduco la posizione nella via in cui si trova l'utente
        //ABBIAMO I MENUS
        ViewModel.getMenus(route.params.user.sid).then( (result) => {
            console.log(result)
        })
    },[])
    return (
        <View>
            <Text>Home</Text>
            <Button title="Reset" onPress={() => ViewModel.reset()}/>
        </View>
    )
}
export default Home;