import React, { Component } from 'react';
import { StyleSheet, View, WebView } from 'react-native';
import { inject, observer } from 'mobx-react';

@inject('tradingPairStore')
@observer
export default class ChartBox extends Component {
    render() {
        const { selectedTradingPair } = this.props.tradingPairStore || {};
        const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `
        
        return (
            <View style={styles.container}>
                <WebView
                    ref={(view) => this.webView = view}
                    originWhitelist={['*']}
                    source={{
                        uri: `${Expo.Constants.manifest.extra.REACT_WEB_API_ENDPOINT}/chart-view/${selectedTradingPair ? selectedTradingPair.name : ''}`,
                    }}

                    injectedJavaScript={INJECTEDJAVASCRIPT}
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