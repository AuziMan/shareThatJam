import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Make sure this is imported
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack Navigator
import UserPlaylists from '../Screens/UserPlaylists';
import { View } from 'react-native';

import TopTracks from '../Screens/TopTracks';
import PlaylistTracks from '../Screens/PlaylistTracks';
import NewPlaylistScreen from '../Screens/NewPlaylistScreen'
import NowPlaying from '../Services/NowPlaying';

// Create the Tab and Stack navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// PlaylistStack: Wrap UserPlaylists and PlaylistTracks in a Stack Navigator
function PlaylistStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserPlaylists" component={UserPlaylists} />
      <Stack.Screen name="PlaylistTracks" component={PlaylistTracks} />
      <Stack.Screen name="NewPlaylist" component={NewPlaylistScreen} />
    </Stack.Navigator>
  );
}

// MainNavigator: Use Bottom Tab Navigator
export default function MainNavigator() {
  return (
    <Tab.Navigator>
      {/* Use PlaylistStack for the Playlists tab */}
      <Tab.Screen name="Playlists" component={PlaylistStack} />
      <Tab.Screen
                name="NowPlaying"
                component={View} // Placeholder
                options={{
                    tabBarButton: () => <NowPlaying />,
                }}
            />
      <Tab.Screen name="Top Tracks" component={TopTracks} />
    </Tab.Navigator>
  );
}
