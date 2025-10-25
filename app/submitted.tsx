import React, { useEffect } from "react";
import {View, Text, StyleSheet} from "react-native";

export default function Submitted({navigation}: {navigation: any}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate("Welcome");
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Survey Submitted</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "blue",
    },
})