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
import { observable, computed } from 'mobx';
import SearchBar from './SearchBar';
import TradingPairTable from './TradingPairTable';

@inject('tradingPairStore', 'pubnub')
@observer
class TradingPairBox extends Component {
  // @computed

  constructor(props) {
    super(props);
    this.pubnubChannel = ""; // TODO trading pairs 보내는 채널 정보 받기
  }

  componentDidMount() {
    this.props.pubnub.subscribe(this.pubnubChannel);
    this.props.tradingPairStore.loadTradingPairs();
  }
  componentWillUnmount() {
    this.props.pubnub.unsubscribe(this.pubnubChannel);
  }
  static getDerivedStateFromProps(props, state) {
    console.log(props.tradingPairStore);
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar></SearchBar>
        <ScrollView style={styles.tradingPairTableContainer}>
          <TradingPairTable></TradingPairTable>
        </ScrollView>
      </View>
    );
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