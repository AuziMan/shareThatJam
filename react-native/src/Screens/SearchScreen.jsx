import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/config';
import { SearchBar } from 'react-native-elements';

const SearchScreen = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={setSearch}
        value={search}
        lightTheme
        round
        containerStyle={{
          backgroundColor: 'transparent',
          borderBottomColor: 'transparent',
          borderTopColor: 'transparent',
        }}
        inputContainerStyle={{
          backgroundColor: '#e0e0e0',
        }}
      />
      <Text style={{ marginTop: 20 }}>Search Query: {search}</Text>
    </View>
  );
};

export default SearchScreen;
