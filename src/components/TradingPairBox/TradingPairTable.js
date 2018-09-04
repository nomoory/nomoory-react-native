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
import { observable } from 'mobx';
import TradingPairTableHeader from './TradingPairTableHeader';
import TradingPairTableBody from './TradingPairTableBody';

// @inject('')
@observer
class TradingPairTable extends Component {
  @observable variable = 4;
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TradingPairTableHeader></TradingPairTableHeader>
        <TradingPairTableBody></TradingPairTableBody>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },    
})
export default TradingPairTable;