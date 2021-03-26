import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import DealItem from './DealItem';

export class DealList extends Component {
  render() {
    return (
      <View style={styles.list}>
        <FlatList
          data={this.props.deals}
          renderItem={({item}) => {
            return (
              <DealItem deal={item} onItemPress={this.props.onItemPress} />
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#eee',
    flex: 1,
    width: '100%',
  },
});

export default DealList;
