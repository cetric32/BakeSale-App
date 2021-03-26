import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {priceDisplay} from '../util';

export class DealItem extends Component {
  handlePress = () => {
    this.props.onItemPress(this.props.deal.key);
  };

  render() {
    const {deal} = this.props;

    return (
      <TouchableOpacity style={styles.deal} onPress={this.handlePress}>
        <Image source={{uri: deal.media[0]}} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}> {deal.title} </Text>
          <View style={styles.footer}>
            <Text style={styles.cause}> {deal.cause.name} </Text>
            <Text style={styles.price}> {priceDisplay(deal.price)} </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  deal: {
    marginHorizontal: 12,
    marginTop: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    borderTopWidth: 0,
  },
  footer: {
    flexDirection: 'row',
  },
  cause: {
    flex: 2,
  },
  price: {
    flex: 1,
    textAlign: 'right',
  },
});

export default DealItem;
