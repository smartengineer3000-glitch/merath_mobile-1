import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EngineTestScreen from "../screens/settings/EngineTestScreen";

const Stack = createNativeStackNavigator();

export function EngineTestStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EngineTestHome" component={EngineTestScreen} />
    </Stack.Navigator>
  );
}
