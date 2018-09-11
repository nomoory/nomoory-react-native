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



@inject('tradingPairStore')
@observer
class TradingPairTableHeader extends Component {
  @observable variable = 4;
  constructor(props) {
    super(props);
  }
  render() {
    const tradingPairStore= this.props.tradingPairStore;
    return (
      <View style={ styles.container }>
        <View style={ this.props.columStyles[0] }>
          <Text onPress={ this._toggleLanguageForTokenName }>
            { tradingPairStore.displayNameOfLanguageForTokenName }
          </Text>
        </View>
        { 
          tradingPairStore.sorts.map((sort, index) => (
            <View key={ sort.name } style={ this.props.columStyles[index + 1] }>
              <Text onPress={ this._toggleSortDirectionOf(sort.name) }>
                { sort.displayName + ' ' + sort.direction }
              </Text>
            </View>
          ))
        }
      </View>
    );
  }
  _toggleLanguageForTokenName = () => {
    this.props.tradingPairStore.toggleLanguageForTokenName();
  };
  _toggleSortDirectionOf = (target) => {
    return () => {
      this.props.tradingPairStore.toggleSortDirectionOf(target);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 30,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  }
})
export default TradingPairTableHeader;