import { StatusBar } from 'expo-status-bar';
import AppNavigation from './navigation/appNavigation';
import { Text, View } from 'react-native';


export default function App() {
  return (
    // <View className="flex-1 items-center justify-center bg-white">
    //   <Text className='text-red-500'>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <AppNavigation />
  );
}

// https://maps.googleapis.com/maps/api/place/textsearch/json?query=Lulu&key=AIzaSyAlIDUiTW6M9p6qb7mHsMCvqk0_OMO3MV0"