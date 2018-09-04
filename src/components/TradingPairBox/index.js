import React, { Component } from 'react';
import { 
  StyleSheet,
  Button, 
  Text, 
  View,
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import { } from 'native-base';
import { 
    inject, 
    observer 
} from 'mobx-react';
import { observable } from 'mobx';
import SearchBar from './SearchBar';

// @inject('')
@observer
class TradingPairBox extends Component {
  @observable searchingText = '';
  constructor(props) {
    super(props);
  }
  @computed
  searchingTradingPairs = () => {
    let tradingPairs = this.props.tradingPairStore.tradingPairs;
    this.filteredTradingPairsWithSearchingText = this._filterWithSearchingText(tradingPairs);
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar search={this.search}></SearchBar>
        <ScrollView style={styles.tradingPairTableContainer}>
          <TradingPairTable
            tradingPairs={this.searchingTradingPairs}></TradingPairTable>
        </ScrollView>
      </View>
    );
  }

  search = (text) => {
    
  }

  _filterWithSearchingText = (tradingPairs) => {
    let searchingText = this.searchingText;
    // TODO filter tradingPairs with text
    let filteredTradingPairs = null;
    return filteredTradingPairs;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  tradingPairTableContainer: {

  }
})
export default TradingPairBox;