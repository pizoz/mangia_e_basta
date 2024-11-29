import React from 'react'
import { View, Text, Button } from 'react-native'
import ViewModel from '../model/ViewModel';
import Menu from './Menu'

const Home = ({navigation}) => {
    return (
        <View>
            <Text>Home</Text>
            <Button title="Reset" onPress={() => ViewModel.reset()}/>
            <Menu></Menu>
        </View>
    )
}
export default Home;