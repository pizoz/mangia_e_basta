import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Order = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Order</Text>
        </View>
    )
};

export default Order;

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