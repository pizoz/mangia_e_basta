import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import ViewModel from '../model/ViewModel';

const ConfirmOrder = ({ navigation }) => {
    const lastMenu = ViewModel.getLastMenu();
    const user = ViewModel.user;
    const locationCoords = ViewModel.getLocationCoords();

    //console.log("Last Menu: ", lastMenu);
    //console.log("User: ", user);
    //console.log("Location: ", locationCoords);

    const handleConfirmOrder = async () => {
        //ho fatto try perchè confirm oder era async non so se serve eheh
        // console.log("Confirming order...");
        // console.log("User: ", user.sid);
        // console.log("Last Menu: ", lastMenu.mid);
        // console.log("Location: ", locationCoords);

        try {

            await ViewModel.confirmOrder(lastMenu, user, locationCoords);

        } catch (error) {
            console.error("Error during order confirmation: ", error);
        } finally {

            navigation.navigate("Order");

            console.log("Order confirmed");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Confirm Order</Text>
            <Text style={styles.text}>Menu: {lastMenu.name}</Text>
            <Button title="Confirm Order" onPress={() => handleConfirmOrder()} />
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