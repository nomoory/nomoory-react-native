import React, { Component } from 'react';
import { StyleSheet, View, WebView, TouchableOpacity, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';

const MESSAGE_TYPE = {
    WIDGET_OPTION: 'WIDGET_OPTION',
    ON_SELECTED_TRADING_PAIR_CHANGED: 'ON_SELECTED_TRADING_PAIR_CHANGED',
    TEST: 'TEST'
}

@inject('tradingPairStore')
@observer
export default class ChartBox extends Component {
    static defaultProps = {
		symbol: '',
		interval: '30',
		containerId: 'tv_chart_container',
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		fullscreen: false,
		custom_css_url: 'custom.scss',
		autosize: true,
		studiesOverrides: {
			"volume.volume.color.0": "#0042b7",
			"volume.volume.color.1": "#ec5761",
			"volume.volume.transparency": 70,
		},
    };

    initWidget = () => {
        const selectedTradingPairName = this.props.tradingPairStore.selectedTradingPairName;
		const widgetOptions = {
			debug: false,
			symbol: selectedTradingPairName,
			// datafeed: Datafeed,
			interval: this.props.interval,
			container_id: this.props.containerId,
			timezone: 'Asia/Seoul',
			library_path: this.props.libraryPath,
			// 번역
			locale: 'ko',
			disabled_features: [
				'use_localstorage_for_settings',
				'header_symbol_search',
				'symbol_search_hot_key',
				'header_compare',
				'compare_symbol',
				'header_saveload',
				'header_undo_redo',
				'header_settings',
				'border_around_the_chart',
				// 'chart_property_page_background'
			],
			enabled_features: [
				'hide_left_toolbar_by_default',
				// 'remove_library_container_border',
			],
			loading_screen: { backgroundColor: "#ebeff2", foregroundColor: "#0042b7" },
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			custom_css_url: this.props.custom_css_url,
			width: this.props.isMobile ? '100%' : '900px',
			height: '400px',
			// autosize: this.props.autosize,
			time_frames: [
				// { text: "2y", resolution: "D", description: "2 Years" },
				// { text: "1y", resolution: "D", description: "1 Year", },
				{ text: "6month", resolution: "D", description: "6 Month" },
				{ text: "1month", resolution: "60", description: "1 Month" },
				{ text: "1week", resolution: "30", description: "1 Week" },
			],
			studies_overrides: this.props.studiesOverrides,
			overrides: {
				// "mainSeriesProperties.showCountdown": true,
				"paneProperties.background": "#fff",
				"paneProperties.vertGridProperties.color": "rgb(221, 221, 221)",
				"paneProperties.horzGridProperties.color": "rgb(221, 221, 221)",
				"symbolWatermarkProperties.transparency": 90,
				"scalesProperties.textColor": "#4a4a4a",
				// "mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				// "mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
				"paneProperties.crossHairProperties.color": "#666",
				"paneProperties.crossHairProperties.width": 1,
				"paneProperties.crossHairProperties.style": "solid",
				"paneProperties.topMargin": 12,
				"paneProperties.bottomMargin": 3,
				// "mainSeriesProperties.prevClosePriceLineColor": "red",
				// "mainSeriesProperties.candleStyle.upColor": "#6ba583",
				// Filled Candle styles
				"mainSeriesProperties.candleStyle.upColor": "#ec5761",
				"mainSeriesProperties.candleStyle.downColor": "#0042b7",
				"mainSeriesProperties.candleStyle.drawBorder": false,
				"mainSeriesProperties.candleStyle.borderUpColor": "#ec5761",
				"mainSeriesProperties.candleStyle.borderDownColor": "#0042b7",
				"mainSeriesProperties.candleStyle.drawWick": true,
				"mainSeriesProperties.candleStyle.wickUpColor": "#ec5761",
				"mainSeriesProperties.candleStyle.wickDownColor": "#0042b7",
				// Hollow Candles styles
				"mainSeriesProperties.hollowCandleStyle.upColor": "#ec5761",
				"mainSeriesProperties.hollowCandleStyle.downColor": "#0042b7",
				"mainSeriesProperties.hollowCandleStyle.drawWick": true,
				"mainSeriesProperties.hollowCandleStyle.drawBorder": true,
				"mainSeriesProperties.hollowCandleStyle.borderUpColor": "#ec5761",
				"mainSeriesProperties.hollowCandleStyle.borderDownColor": "#0042b7",
				"mainSeriesProperties.hollowCandleStyle.wickUpColor": "#ec5761",
				"mainSeriesProperties.hollowCandleStyle.wickDownColor": "0042b7",
				// // Heikin Ashi styles
				"mainSeriesProperties.haStyle.upColor": "#ec5761",
				"mainSeriesProperties.haStyle.downColor": "#0042b7",
				"mainSeriesProperties.haStyle.drawWick": true,
				"mainSeriesProperties.haStyle.drawBorder": true,
				"mainSeriesProperties.haStyle.borderUpColor": "#ec5761",
				"mainSeriesProperties.haStyle.borderDownColor": "#0042b7",
				"mainSeriesProperties.haStyle.wickUpColor": "#ec5761",
				"mainSeriesProperties.haStyle.wickDownColor": "#0042b7",
				"mainSeriesProperties.haStyle.barColorsOnPrevClose": false,

				// Bar styles
				"mainSeriesProperties.barStyle.upColor": "#ec5761",
				"mainSeriesProperties.barStyle.downColor": "#0042b7",
				"mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
				"mainSeriesProperties.barStyle.dontDrawOpen": false,

				// Volume Area
				// "mainSeriesProperties.showPriceLine": true,
				// "volumePaneSize": "small"
			},
        };

        this.webView.postMessage(JSON.stringify({
            type: MESSAGE_TYPE.WIDGET_OPTION, 
            message: widgetOptions
        }));
    }

    componentDidMount() {
        this.initWidget();
        reaction(
            () => this.props.tradingPairStore.selectedTradingPairName,
            (selectedTradingPairName) => {
                if (selectedTradingPairName) {
                    this.webView.postMessage(JSON.stringify({
                        type: MESSAGE_TYPE.ON_SELECTED_TRADING_PAIR_CHANGED, 
                        message: {
                            selectedTradingPairName: selectedTradingPairName,
                            interval: this.props.interval,
                        }
                    }));
                }
            }
        );
    }

    _onTest = () => {
        this.webView.postMessage(JSON.stringify({ type: MESSAGE_TYPE.ON_SELECTED_TRADING_PAIR_CHANGED }));
    }

    _html = () => {
        const endpoint = Expo.Constants.manifest.extra.REACT_APP_DEV_ASSET_ORIGIN;
        let html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="${endpoint}/charting_library/charting_library.min.js"></script>
                    ${this._onMessageScript()}
                </head>
                <body>
                    <div
                        id=${this.props.containerId}
                        class='TVChartContainer'
                    ></div>
                    <div id="demo">test</div>
                </body>
            </html>
        `;
        
        return html;
    }

    _onMessageScript = () => {
        return `
            <script>
                document.addEventListener("message", function(event) {
                    let data = JSON.parse(event.data);
                    switch (data.type) {
                        case 'WIDGET_OPTION': {
                            let widgetOptions = data.message;
                            try {
                                window.tvWidget = new window.TradingView.widget(widgetOptions);
                            } catch (err) {
                                document.getElementById('demo').innerHTML = JSON.stringify(err);
                            }
                            break;
                        }

                        case 'TRADING_PAIR_CHANGED': {
                            if (window.tvWidget._ready) {
                                window.tvWidget.setSymbol(data.message.selectedTradingPairName, data.message.interval);
                            } else {
                                window.tvWidget.onChartReady(() => {
                                    window.tvWidget.setSymbol(data.message.selectedTradingPairName, data.message.interval);
                                })
                            }
                            document.getElementById('demo').innerHTML = 'TRADING_PAIR_CHANGED';
                            break;
                        }

                        default:
                            document.getElementById('demo').innerHTML = 'default';
                            break;
                    }
                }, false);
            </script>
        `;
    }

    render() {
        const {
            containerId,
        } = this.props;

        return (
            <View style={styles.container}>
                <WebView
                    ref={(view) => this.webView = view}
                    originWhitelist={['*']}
                    source={{
                        html: this._html()
                    }}

                    // injectedJavaScript={this.injectedJavaScript}
                    javaScriptEnabledAndroid={true}
                    javaScriptEnabled={true}
                />
                <TouchableOpacity onPress={this.initWidget}>
                    <Text>매수</Text>
                </TouchableOpacity>
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