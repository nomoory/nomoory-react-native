import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
} from 'react-native';
import { 
  Input, 
  Item, 
  Label
} from 'native-base';
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
      <View style={this.props.style || styles.container}>
        <Item floatingLabel last>
          <Label>코인명</Label>
          <Input onChangeText={this.onChangeSearchBar}/>
        </Item>
      </View>
    );
  }

  onChangeSearchBar = (searchKeyword) => {
    this.props.tradingPairStore.setSearchKeyword(searchKeyword);
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: 'white'
  },    
})
export default SearchBar;