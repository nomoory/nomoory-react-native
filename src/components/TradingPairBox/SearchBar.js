import React, { Component } from 'react';
import { 
  StyleSheet,
  Button, 
  Text, 
  View,
  TextInput,
  TouchableOpacity 
} from 'react-native';
import { } from 'native-base';
import { 
    inject, 
    observer 
} from 'mobx-react';
import { observable } from 'mobx';

@inject('tradingPairStore')
@observer
class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={this.onSearch}
          value={this.props.tradingPairStore.searchKeyword}
        />
      </View>
    );
  }

  onSearch = (searchKeyword) => {
    this.props.tradingPairStore.updateSearchKeyword(searchKeyword);
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },    
})
export default SearchBar;