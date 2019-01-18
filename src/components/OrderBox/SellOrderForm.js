import React, { Component } from 'react';
import commonStyle from '../../styles/commonStyle';
import { StyleSheet, View, TouchableOpacity, TextInput, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('tradingPairStore', 'orderStore', 'accountStore', 'userStore')
@observer
export default class SellOrderForm extends Component {
    componentDidMount() {
        let { close_price } = this.props.tradingPairStore.selectedTradingPair || {};
        this.props.orderStore.setPrice(close_price ? Decimal(close_price).toFixed() : '0');
        this.props.orderStore.setVolume('0');
        this.props.orderStore.setSide('SELL'); // SELL side임을 보장하기 위함
    }

    @computed get maxFeePercentage() { return number.getRateAsFiexdPercentage(this.props.orderStore.maxFeeRate, 2); }

    _onChangePrice = (text) => {
        this.props.orderStore.setPriceFromInput(text);
    }
    _onChangeVolume = (text) => {
        this.props.orderStore.setVolumeFromInput(text);
    }
    _onPressOrder = (e) => {
        this.props.orderStore.registerOrder();
    }
    _onPressIncreasePrice = (e) => { this.props.orderStore.increasePriceByButton(); }
    _onPressDecreasePrice = (e) => { this.props.orderStore.decreasePriceByButton(); }
    _onPressSetVolumeByRate = (rate) => () => { if (this.props.userStore.isLoggedIn) this.props.orderStore.setVolumeByRate(rate); }
    _onPressLogin = (e) => {
        this.props.navigation.navigate('Login');
    }

    render() {
        let {
            values,
            baseSymbol,
            quoteSymbol,
            amount,
            maxFee,
            totalGain,
            minimumOrderAmount
        } = this.props.orderStore || {};
        const { price, volume } = values || {};
        const targetAccount = this.props.accountStore.getAccountByAssetSymbol(baseSymbol)  || {}
        const orderFormStyle = this.props.orderFormStyle;

        return (
            <View style={styles.container}>
                <View style={[orderFormStyle.liquidContainer]}>
                    <Text style={orderFormStyle.liquidTitle}>판매가능</Text>
                    <View style={orderFormStyle.liquidContentContainer}>
                        <Text style={orderFormStyle.liquidContentText}>
                            {
                                targetAccount.liquid ? 
                                number.putComma(Decimal(targetAccount.liquid).toFixed()) 
                                : '-' 
                            }
                        </Text>
                        <Text style={orderFormStyle.liquidContentUnitText}> 
                            {baseSymbol}
                        </Text>
                    </View>
                </View>
                <View style={[orderFormStyle.inputContainer, orderFormStyle.priceInputContiner]}>
                    <TextInput style={orderFormStyle.textInput}
                        onChangeText={this._onChangePrice}
                        // placeholder={`가격`}
                        keyboardType={'numeric'}
                        value={`${price}`}
                    />
                    <View style={orderFormStyle.inputTitleContainer}>
                        <Text style={orderFormStyle.inputTitle}>{`가격`}</Text>
                    </View>
                    <View style={orderFormStyle.inputUnitContainer}>
                        <Text style={orderFormStyle.inputUnit}>{`${quoteSymbol}`}</Text>
                    </View>
                </View>
                <View style={[orderFormStyle.setPriceButtonsContainer]}>
                    <View style={[orderFormStyle.emptySpace]}></View>
                    <View style={[orderFormStyle.setPriceButtons]}>
                        <TouchableOpacity style={[orderFormStyle.plusButton, orderFormStyle.priceButton]} onPress={this._onPressIncreasePrice}>
                            <Text>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[orderFormStyle.minusButton, orderFormStyle.priceButton]} onPress={this._onPressDecreasePrice}>
                            <Text>-</Text>
                        </TouchableOpacity>    
                    </View>
                </View>
                <View style={[orderFormStyle.inputContainer, orderFormStyle.volumeInputContainer]}>
                    <TextInput style={orderFormStyle.textInput}
                        onChangeText={this._onChangeVolume}
                        // placeholder={`수량`}
                        keyboardType={'numeric'}
                        value={`${volume}`}
                    />
                    <View style={orderFormStyle.inputTitleContainer}>
                        <Text style={orderFormStyle.inputTitle}>{`수량`}</Text>
                    </View>
                    <View style={orderFormStyle.inputUnitContainer}>
                        <Text style={orderFormStyle.inputUnit}>{`${baseSymbol}`}</Text>
                    </View>
                </View>
                <View style={orderFormStyle.setVolumeButtons}>
                    <TouchableOpacity style={[orderFormStyle.setVolumeButton]} onPress={this._onPressSetVolumeByRate(0.25)}>
                        <Text style={orderFormStyle.setVolumeButtonText}>25%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[orderFormStyle.setVolumeButton, orderFormStyle.setVolumeButtonNotInFirst]} onPress={this._onPressSetVolumeByRate(0.5)}>
                        <Text style={orderFormStyle.setVolumeButtonText}>50%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[orderFormStyle.setVolumeButton, orderFormStyle.setVolumeButtonNotInFirst]} onPress={this._onPressSetVolumeByRate(0.75)}>
                        <Text style={orderFormStyle.setVolumeButtonText}>75%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[orderFormStyle.setVolumeButton, orderFormStyle.setVolumeButtonNotInFirst]} onPress={this._onPressSetVolumeByRate(1)}>
                        <Text style={orderFormStyle.setVolumeButtonText}>100%</Text>
                    </TouchableOpacity> 
                </View>
                <View style={[styles.amountContainer, orderFormStyle.infoContainer]}>
                    <Text style={[styles.amountTitle, orderFormStyle.infoTitle]}>판매금액</Text>
                    <Text style={[styles.amountContent, orderFormStyle.infoContent]}>{amount ? number.putComma(Decimal(amount).toFixed()) : '-'} {baseSymbol}</Text>
                </View>
                <View style={[styles.feeContainer, orderFormStyle.infoContainer]}>
                    <Text style={[orderFormStyle.infoTitle]}>수수료</Text>
                    <Text style={[orderFormStyle.infoContent]}>{maxFee ? number.putComma(Decimal(maxFee).toFixed()) : '-' } {baseSymbol}</Text>
                </View>
                <View style={orderFormStyle.maxFeePercentageContainer}> 
                    <Text style={orderFormStyle.maxFeePercentageContent}>
                        { this.maxFeePercentage ? number.putComma(Decimal(this.maxFeePercentage).toFixed()) : '-' } %
                    </Text>
                </View>
                <View style={[styles.totalGainContainer, orderFormStyle.infoContainer]}>
                    <Text style={[styles.totalGainTitle, orderFormStyle.infoTitle]}>수령총액</Text>
                    <Text style={[styles.totalGainContent, orderFormStyle.infoContent]}>{totalGain ? number.putComma(Decimal(totalGain).toFixed()) : '-'} {quoteSymbol}</Text>
                </View>
                <View style={orderFormStyle.minimumOrderAmountContainer}>
                    <Text style={orderFormStyle.minimumOrderAmountContent}>
                        최소주문금액 {minimumOrderAmount ? number.putComma(Decimal(minimumOrderAmount).toFixed()) : '-' } {quoteSymbol}
                    </Text>
                </View>
                {
                    this.props.userStore.isLoggedIn ? 
                    <TouchableOpacity style={[orderFormStyle.button, orderFormStyle.blueButton]} onPress={this._onPressOrder}>
                        <Text style={[orderFormStyle.buttonText]}>판매</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={[orderFormStyle.button, orderFormStyle.blueButton]} onPress={this._onPressLogin}>
                        <Text style={[orderFormStyle.buttonText]}>로그인</Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});