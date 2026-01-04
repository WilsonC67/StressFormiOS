import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Submitted() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            // Use replace so the user can't go back to the submitted screen
            router.replace("/welcome"); 
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Survey submitted. Thank you!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F2F2F7",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#007AFF",
    },
});