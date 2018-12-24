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
import TradingPairSearchBar from './TradingPairSearchBar';
// import TradingPairTab from './TradingPairTab'; // 원화 이외의 quote open시 적용
import TradingPairTable from './TradingPairTable';

@inject('tradingPairStore', 'pubnub')
@observer
class TradingPairBox extends Component {

    constructor(props) {
        super(props);
        this.pubnubChannel = ""; // TODO trading pairs 보내는 채널 정보 받기
    }

    componentDidMount() {
        // this.props.pubnub.subscribe(this.pubnubChannel);
        // this.props.tradingPairStore.loadTradingPairs();
    }
    componentWillUnmount() {
        // this.props.pubnub.unsubscribe(this.pubnubChannel);
    }

    render() {
        return (
            <View style={styles.container}>
                <TradingPairSearchBar />
                <View style={styles.tradingPairTableContainer}>
                    <TradingPairTable />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tradingPairTableContainer: {
        flex: 1
    }
});

export default TradingPairBox;