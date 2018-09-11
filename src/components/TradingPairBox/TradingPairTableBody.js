import React, { Component } from 'react';
import { 
  StyleSheet,
  Button, 
  Text, 
  ScrollView, 
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
    const tradingPairs = this.props.tradingPairStore.tradingPairs;
    return (
      <ScrollView style={styles.container}>
        {
          tradingPairs.map((tradingPair, idx) => 
            <TradingPairRow 
              key={idx} 
              tradingPair={tradingPair} 
              columStyles={this.props.columStyles} 
            ></TradingPairRow>
          )
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },    
})
export default TradingPairTableBody;