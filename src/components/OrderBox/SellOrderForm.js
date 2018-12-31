import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Text, Button, Item, Input } from 'native-base';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';

@inject('tradingPairStore', 'orderStore', 'accountStore', 'userStore')
@observer
export default class SellOrderForm extends Component {
    componentDidMount() {
        let { close_price } = this.props.tradingPairStore.selectedTradingPair || {};
        this.props.orderStore.setPrice(close_price || '0');
        this.props.orderStore.setVolume('0');
    }

    @computed get maxFeePercentage() { return number.getRateAsFiexdPercentage(this.props.orderStore.maxFeeRate, 2); }
    @computed get targetAccount() {
        let { isBuy, baseSymbol, quoteSymbol } = this.props.orderStore;
        let symbol = isBuy ? quoteSymbol : baseSymbol;
        return this.props.accountStore.getAccountByAssetSymbol(symbol) || {};
    }

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

    render() {
        const { tradingPairStore, orderStore } = this.props || {};
        let {
            values,
            baseSymbol,
            quoteSymbol,
            amount,
            maxFee,
            totalGain,
            minimumOrderAmount
        } = orderStore || {};
        const { price, volume } = values || {};

        return (
            <Container style={styles.container}>
                <View style={[styles.liquidContainer]}>
                    <Text style={styles.liquidTitle}>판매가능</Text>
                    <Text style={styles.liquidContent}>{this.targetAccount.liquid ? number.putComma(Decimal(this.targetAccount.liquid)) : '-' } {baseSymbol}</Text>
                </View>
                <View style={[styles.InputContainer, styles.priceInputContiner]}>
                    <Item>
                        <Input styles={styles.priceInput}
                            onChangeText={this._onChangePrice}
                            placeholder={`가격`}
                            keyboardType={'numeric'}
                            value={`${price}`}
                        />
                        <Text styles={styles.priceInputUnit}>{`${quoteSymbol}`}</Text>
                        <Button style={[styles.plusButton, styles.coblicGreyButton]} onPress={this._onPressIncreasePrice}>
                            <Text>+</Text>
                        </Button>
                        <Button style={[styles.minusButton, styles.coblicGreyButton]} onPress={this._onPressDecreasePrice}>
                            <Text>-</Text>
                        </Button>    
                    </Item>
                </View>
                <View style={[styles.InputContainer, styles.volumeInputContainer]}>
                    <Item>
                        <Input styles={styles.volumeInputUnit}
                            onChangeText={this._onChangeVolume}
                            placeholder={`수량`}
                            keyboardType={'numeric'}
                            value={`${volume}`}
                        />
                        <Text styles={styles.volumeInputUnit}>{`${baseSymbol}`}</Text>
                    </Item>
                </View>
                <View style={styles.setVolumeButtons}>
                    <Button style={[styles.setVolumeButton, styles.coblicGreyButton]} onPress={this._onPressSetVolumeByRate(0.25)}>
                        <Text>25%</Text>
                    </Button>
                    <Button style={[styles.setVolumeButton, styles.coblicGreyButton]} onPress={this._onPressSetVolumeByRate(0.5)}>
                        <Text>50%</Text>
                    </Button>
                    <Button style={[styles.setVolumeButton, styles.coblicGreyButton]} onPress={this._onPressSetVolumeByRate(0.75)}>
                        <Text>75%</Text>
                    </Button>
                    <Button style={[styles.setVolumeButton, styles.coblicGreyButton]} onPress={this._onPressSetVolumeByRate(1)}>
                        <Text>100%</Text>
                    </Button> 
                </View>
                <View style={[styles.amountContainer, styles.info]}>
                    <Text style={styles.amountTitle}>판매금액</Text>
                    <Text style={styles.amountContent}>{amount ? number.putComma(Decimal(amount).toFixed()) : ''} {baseSymbol}</Text>
                </View>
                <View style={[styles.info, styles.feeContainer]}>
                    <Text>수수료</Text>
                    <Text>{maxFee ? number.putComma(Decimal(maxFee).toFixed()) : '' } {baseSymbol}</Text>
                </View>
                <View style={styles.maxFeePercentageContainer}> 
                    <Text style={styles.maxFeePercentageContent}>
                        { maxFee ? number.putComma(Decimal(this.maxFeePercentage).toFixed()) : '' } %
                    </Text>
                </View>
                <View style={[styles.totalGainContainer, styles.info]}>
                    <Text style={styles.totalGainTitle}>수령총액</Text>
                    <Text style={styles.totalGainContent}>{totalGain ? number.putComma(Decimal(totalGain).toFixed()) : ''} {quoteSymbol}</Text>
                </View>
                <View style={styles.minimumOrderAmountContainer}> 
                    <Text style={styles.minimumOrderAmountContent}>
                        최소주문금액 {minimumOrderAmount ? number.putComma(Decimal(minimumOrderAmount).toFixed()) : '' } {quoteSymbol}
                    </Text>
                </View>
                <Button style={[styles.buyButton, styles.coblicBlueButton]} onPress={this._onPressOrder}>
                    <Text>판매</Text>
                </Button>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    price : {
        
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    liquidContent: {
        alignSelf: 'flex-end'
    },
    maxFeePercentageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    maxFeePercentageContent: {
        fontSize: 12,
    },
    setVolumeButtons: {
        flexDirection: 'row'
    },
    setVolumeButton: {
        flex: 1
    },
    minimumOrderAmountContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    minimumOrderAmountContent: {
        fontSize: 12        
    }
});