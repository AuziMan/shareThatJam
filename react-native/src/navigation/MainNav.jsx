import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Make sure this is imported
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack Navigator
import UserPlaylists from '../Screens/UserPlaylists';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For three-dot menu icon
import TopTracks from '../Screens/TopTracks';
import PlaylistTracks from '../Screens/PlaylistTracks';
import NewPlaylistScreen from '../Screens/NewPlaylistScreen'
import NowPlaying from '../Services/NowPlaying';
import SearchScreen from '../Screens/SearchScreen';
import NowPlayingMonitor from '../utils/Playback/PlaybackMonitor';
import QueueScreen from '../Screens/QueueScreen';

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
      <Stack.Screen name="QueueScreen" component={QueueScreen} />
    </Stack.Navigator>
  );
}

// MainNavigator: Use Bottom Tab Navigator
export default function MainNavigator() {
  return (
    <>
      <NowPlayingMonitor/>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Playlists') {
              iconName = 'folder-music';
            } else if (route.name === 'NowPlaying') {
              return <NowPlaying />; // Custom Component for the Now Playing Button
            } else if (route.name === 'Top Tracks') {
              iconName = 'trending-up';
            } else if (route.name == 'Search Screen') {
              iconName = 'card-search'
            } else if (route.name == 'Queue Screen') {
              iconName = 'playlist-music'
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarShowLabel: false, // Hide labels if preferred
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'black',
        })}
      >
        <Tab.Screen name="Playlists" component={PlaylistStack} />
        <Tab.Screen name="NowPlaying" component={View} options={{ tabBarButton: () => <NowPlaying /> }} />
        <Tab.Screen name="Top Tracks" component={TopTracks} />
        <Tab.Screen name="Search Screen" component={SearchScreen}/>
        <Tab.Screen name="Queue Screen" component={QueueScreen} onPress={() => console.log("test")}/>


      </Tab.Navigator>
    </>
  );
}

// function NowPlayingNav() {
//   return (
//     <Tab.Navigator>
//       {/* Use PlaylistStack for the Playlists tab */}
//       <Tab.Screen
//                 name="NowPlaying"
//                 component={View} // Placeholder
//                 options={{
//                     tabBarButton: () => <NowPlaying />,
//                 }}
//             />
//     </Tab.Navigator>
//   );
// }
