import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/homeScreen";
import { SafeAreaView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="home" options={{headerShown: false}} component={HomeScreen}/>
            </Stack.Navigator>
        
        </NavigationContainer>
    )
}