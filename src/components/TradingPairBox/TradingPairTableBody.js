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

@inject('tradingPairStore')
@observer
class TradingPairTableBody extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.tradingPairStore);
    return (
      <View style={styles.container}>
        {
          // this.props.tradingPairStore.tradingPairs.foreah((tradingPair) =>
          //   <TradingPairRow tradingPair={tradingPair}></TradingPairRow>
          // )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },    
})
export default TradingPairTableBody;