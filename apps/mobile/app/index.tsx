import React from "react";
import { View } from "react-native";
import AuthScreen from "../src/screens/AuthScreen";
import { useAuthContext } from "@/src/contexts/AuthContext";
import DashboardScreen from "@/src/screens/DashboardScreen";

export default function Index() {
  const { user } = useAuthContext();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user ? <DashboardScreen /> : <AuthScreen />}
    </View>
  );
}
