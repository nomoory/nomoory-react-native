import React, { Component } from 'react';
import { 
  StyleSheet,
  Button, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';
import { } from 'native-base';
import { 
    inject, 
    observer 
} from 'mobx-react';
import { computed, observable } from 'mobx';
import TradingPairRow from './TradingPairRow';

// TODO 정렬, 필터 정보 받아서 이에 맞게 rows 걸러주기

// @inject('')
@observer
class TradingPairTableBody extends Component {
  @computed
  filteredAndSortedTradingPairs = () => {
    let filteredTradingPairs  = this._filterTradingPairs(this.props.tradingPairs);
    let filteredAndSortedTradingPairs = this._sortTradingPairs(filteredTradingPairs);
    return filteredAndSortedTradingPairs;
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.filteredAndSortedTradingPairs.foreah((tradingPair) =>
            <TradingPairRow tradingPair={tradingPair}></TradingPairRow>
          )
        }
      </View>
    );
  }
  
  _filterTradingPairs = (tradingPairs) = {

  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },    
})
export default TradingPairTableBody;