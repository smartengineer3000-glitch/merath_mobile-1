import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AboutScreen from "../../screens/settings/AboutScreen";

const Stack = createNativeStackNavigator();

export function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AboutMain" component={AboutScreen} />
    </Stack.Navigator>
  );
}
