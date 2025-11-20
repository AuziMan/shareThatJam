import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/Screens/LoginScreen';
import { PaperProvider } from 'react-native-paper'; // Import PaperProvider
import MainNavigator from './src/navigation/MainNav';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For three-dot menu icon



const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider> 
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login" 
          screenOptions={{ 
            headerShown: false ,
            headerStyle: { backgroundColor: '#1DB954' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            }}>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} // Hide header for login
          />
          <Stack.Screen 
            name="Main" 
            component={MainNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
