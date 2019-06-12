import React, { Component } from 'react';
import { StyleSheet, View, WebView, TouchableOpacity, Text } from 'react-native';
import { inject, observer } from 'mobx-react';

@inject('tradingPairStore')
@observer
export default class ChartBox extends Component {
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    ref={(view) => this.webView = view}
                    originWhitelist={['*']}
                    source={{
                        uri: `${Expo.Constants.manifest.extra.REACT_WEB_API_ENDPOINT}/chart-view/${this.props.tradingPairStore.selectedTradingPair.name}`,
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