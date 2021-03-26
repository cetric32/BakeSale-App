import debounce from 'lodash.debounce';
import React, {Component} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

export class SearchBar extends Component {
  state = {
    searchTerm: '',
  };

  debouncedSearchDeals = debounce(this.props.searchDeals, 300);
  handleChange = searchTerm => {
    this.setState(
      {
        searchTerm,
      },
      () => {
        this.debouncedSearchDeals(this.state.searchTerm);
      },
    );
  };

  render() {
    return (
      <View>
        <TextInput
          placeholder="search deals..."
          style={styles.input}
          onChangeText={this.handleChange}
          value={this.state.searchTerm}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
  },
});
export default SearchBar;
