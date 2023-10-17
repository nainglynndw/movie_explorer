import {SafeAreaView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../theme/colors';
import Header from './SubComponents/Header';
import MovieList from './SubComponents/MovieList';

const HomeScreen = () => {
  const [category, setCategory] = useState('upcoming');

  return (
    <SafeAreaView style={styles.container}>
      <Header category={category} setCategory={setCategory} />
      <MovieList category={category} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.dark.primary,
  },
});
