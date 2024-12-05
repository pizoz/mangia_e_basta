import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import ViewModel from '../model/ViewModel';

const ConfirmOrder = ({navigation}) => {
    const lastMenu = ViewModel.getLastMenu();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Confirm Order</Text>
            <Text style={styles.text}>Menu: {lastMenu.name}</Text>
            <Button title="Confirm Order" onPress={() => navigation.navigate("Order")}/>
        </View>
    )
}
export default ConfirmOrder;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: '#000000'
    }
})