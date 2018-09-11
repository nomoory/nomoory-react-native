import React, { Component } from 'react';
import { 
  StyleSheet,
  Text, 
  View
} from 'react-native';
import { } from 'native-base';
import { 
    inject, 
    observer 
} from 'mobx-react';
import { observable } from 'mobx';

// @inject('')
@observer
class TradingPairRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let openPrice = this.props.tradingPair.open_price;
    return (
      <View style={styles.container}>
        <Text>
          { openPrice }
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },    
})
export default TradingPairRow;