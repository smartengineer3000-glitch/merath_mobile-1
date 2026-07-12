import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ComparisonScreen from "../../screens/comparison/ComparisonScreen";

const Stack = createNativeStackNavigator();

export function ComparisonStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ComparisonHome" component={ComparisonScreen} />
    </Stack.Navigator>
  );
}
