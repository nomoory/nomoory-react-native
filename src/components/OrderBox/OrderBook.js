import React, { Component } from 'react';
import { 
  StyleSheet,
  ScrollView,
  View
} from 'react-native';
import { Text } from 'native-base';
import { 
    inject, 
    observer 
} from 'mobx-react';
import { observable, computed } from 'mobx';
import OrderRow from './OrderRow';

// @inject('tradingPairStore')
@observer
class OrderBook extends Component {
  // @computed

  constructor(props) {
    super(props);
    // this.pubnubChannel = "";
  }

  componentDidMount() {
    // this.props.pubnub.subscribe(this.pubnubChannel);
  }
  componentWillUnmount() {
    // this.props.pubnub.unsubscribe(this.pubnubChannel);
  }

  render() {
    return (
      <View style={ styles.container }>
        <ScrollView>
          sdf
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OrderBook;