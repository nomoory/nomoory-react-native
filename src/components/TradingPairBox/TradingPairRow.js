import React, { Component } from 'react';
import { 
  StyleSheet,
  Text, 
  View,
  TouchableOpacity
} from 'react-native';
import { Container,  } from 'native-base';
import { 
    inject, 
    observer
} from 'mobx-react';
import { observable } from 'mobx';
import { withNavigation } from 'react-navigation';

@withNavigation
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
      <TouchableOpacity 
        style={ styles.container } 
        onPress={ this._onPressTradingPairRow }
      >
        <View style={ this.props.columStyles[0] }>
          <Text>
            { tokenNameForSelectedLanguage + ' ' + tradingPair.name }
          </Text>
        </View>
        {
          tradingPairStore.sorts.map((sort, index) => ( 
            this.props.columStyles[index + 1] ?
            <View key={ sort.name } style={ this.props.columStyles[index + 1] }>
              <Text>{ tradingPair[sort.name] }</Text>
            </View> 
            :
            null
          ))
        }
      </TouchableOpacity>
    );
  }

  _onPressTradingPairRow = (e) => {
    const tradingPairName = this.props.tradingPair.name;
    this._setSelectedTradingPair(tradingPairName);
    this._openTokenScreen();
  }
  _setSelectedTradingPair = (tradingPairName) => {
    this.props.tradingPairStore.setSelecetedTradingPairByTradingPairName(tradingPairName || this.props.tradingPair.name);
  }
  _openTokenScreen = () => {
    let tradingPair = this.props.tradingPair;
    this.props.navigation.navigate('Token', {
      tokenName: tradingPair.quote_korean_name,
      tradingPairName: tradingPair.name
    });
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