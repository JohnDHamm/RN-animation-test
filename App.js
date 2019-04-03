import React from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';

import Timer from './timer'

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Timer/>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'gray'
  },
});
