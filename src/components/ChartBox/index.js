import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { WebView } from 'react-native-webview';

@inject('tradingPairStore')
@observer
export default class ChartBox extends Component {
    render() {
        const {
            selectedTradingPair
        } = this.props.tradingPairStore || {};
        
        return (
            <View style={styles.container}>
                <WebView
                    textZoom={100}
                    originWhitelist={['*']}
                    source={{
                        uri: `${Expo.Constants.manifest.extra.REACT_WEB_API_ENDPOINT}/chart-view/${selectedTradingPair ? selectedTradingPair.name : ''}`,
                    }}
                    javaScriptEnabledAndroid={true}
                    javaScriptEnabled={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
});