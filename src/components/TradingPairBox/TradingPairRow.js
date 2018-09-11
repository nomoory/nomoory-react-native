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

@inject('tradingPairStore')
@observer
class TradingPairRow extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const tradingPairStore = this.props.tradingPairStore;
    const tradingPair = this.props.tradingPair;
    const tokenNameForSelectedLanguage = tradingPairStore.languageForTokenName === 'ko' ?
      tradingPair['quote_korean_name'] :
      tradingPair['quote_english_name'];

    return (
      <View style={styles.container}>
        <View style={ this.props.columStyles[0] }>
          <Text>
            { tokenNameForSelectedLanguage + ' ' + tradingPair['name'] }
          </Text>
        </View>
        {
          tradingPairStore.sorts.map((sort, index) => ( 
            this.props.columStyles[index + 1] ?
            <View style={ this.props.columStyles[index + 1] }>
              <Text>{ tradingPair[sort.name] }</Text>
            </View> 
            :
            null
          ))
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 30,
    flexDirection: 'row'
  }
})
export default TradingPairRow;