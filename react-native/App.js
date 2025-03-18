import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/Screens/LoginScreen';  // Adjust the path based on where LoginScreen is located


const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    // Listen for incoming deep links
    const handleDeepLink = (event) => {
      const { url } = event;
      if (url && url.startsWith('shareThatJam://auth')) {
        // Extract authorization code from the URL
        const code = url.split('code=')[1];
        console.log("Deep link code:", code);
        // You can send this code to your backend for token exchange here
      }
    };

    Linking.addEventListener('url', handleDeepLink);

    // Clean up the event listener on unmount
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
