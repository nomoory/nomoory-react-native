import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';
import TRANSLATIONS from '../../TRANSLATIONS';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('tradingPairStore', 'orderStore', 'accountStore', 'userStore', 'modalStore')
@observer
export default class BuyOrderForm extends Component {
    componentDidMount() {
        this.props.orderStore.setSide('BUY'); // BUY side임을 보장하기 위함
    }
    
    @computed
    get maxFeePercentage() { 
        return number.getRateAsFiexdPercentage(this.props.orderStore.maxFeeRate, 2);
    }

    _onChangePrice = (text = '') => {
        this.props.orderStore.setPriceFromInput(text.split(',').join(''));
    }

    _onChangeVolume = (text = '') => {
        this.props.orderStore.setVolumeFromInput(text.split(',').join(''));
    }

    _onPressOrder = (e) => {
        let {
            values,
            baseSymbol,
            quoteSymbol,
            amount,
            maxFee,
            totalGain,
        } = this.props.orderStore || {};
        const { price, volume } = values || {};
        if (this.props.orderStore.isValidOrder.state === false) {
            this.props.modalStore.openModal({
                title: '주문 실패',
                content: TRANSLATIONS[this.props.orderStore.isValidOrder.message_code],
            })
        } else { 
            try {
                this.props.modalStore.openModal({
                    title: '주문 확인',
                    content: <Text style={{ textAlign: 'center', fontSize: 16}}>{`
거래자산 : ${baseSymbol}/${quoteSymbol}
구매가격 : ${number.putComma(price)} ${quoteSymbol}
구매수량 : ${number.putComma(volume)} ${baseSymbol}
수수료 : ${number.putComma(number.getFixedPrice(maxFee, baseSymbol)) } ${baseSymbol}
수령량 : ${number.putComma(totalGain)} ${baseSymbol}\n
총금액 : ${number.putComma(number.getFixedPrice(amount, quoteSymbol))} ${quoteSymbol}
                    `}</Text>,
                    buttons: [
                        {
                            title: '취소',
                            onPress: () => {this.props.modalStore.closeModal()}
                        },{
                            title: '확인',
                            onPress: () => {
                                this.props.orderStore.registerOrder();
                                this.props.modalStore.closeModal();
                            }
                        }, 
                    ]
                })
            } catch (err) {
                this.props.modalStore.openModal({
                    title: '주문 실패',
                    content: '입력 값들을 확인해주세요.',
                })
            }
        }
    }
    _onPressIncreasePrice = (e) => { this.props.orderStore.increasePriceByButton(); }
    _onPressDecreasePrice = (e) => { this.props.orderStore.decreasePriceByButton(); }
    _onPressSetVolumeByRate = (rate) => () => {
        if (this.props.userStore.isLoggedIn) {
            this.props.orderStore.setVolumeByRate(rate); 
        }
    }
    _onPressInitPrice = (e) => {
        this.props.orderStore.setVolume(0);
        if (this.props.tradingPairStore.selectedTradingPair) {
            this.props.orderStore.setPrice(Decimal(this.props.tradingPairStore.selectedTradingPair.close_price || 0).toFixed());

        }
    }

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
        const targetAccount = this.props.accountStore.getAccountByAssetSymbol(quoteSymbol)  || {}
        const orderFormStyle = this.props.orderFormStyle;

        return (
            <View style={orderFormStyle.container}>
                <View style={[orderFormStyle.liquidContainer]}>
                    <Text style={orderFormStyle.liquidTitle}>주문가능</Text>
                    <View style={orderFormStyle.liquidContentContainer}>
                        <Text style={orderFormStyle.liquidContentText}>
                            {
                                targetAccount.liquid ? 
                                number.putComma(number.getFixedPrice(targetAccount.liquid, quoteSymbol)) 
                                : '-' 
                            }
                        </Text>
                        <Text style={orderFormStyle.liquidContentUnitText}> 
                            {quoteSymbol}
                        </Text>
                    </View>
                </View>
                <View style={[orderFormStyle.volumeInputContainer]}>
                    <TextInput style={orderFormStyle.textInput}
                        onChangeText={this._onChangeVolume}
                        keyboardType={'numeric'}
                        value={number.putComma(volume)}
                    />
                    <View style={orderFormStyle.inputTitleContainer}>
                        <Text style={orderFormStyle.inputTitle}>{`수량`}</Text>
                    </View>
                    {/* <View style={orderFormStyle.inputUnitContainer}>
                        <Text style={orderFormStyle.inputUnit}>{`${baseSymbol}`}</Text>
                    </View> */}
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
                <View style={[orderFormStyle.priceInputContiner]}>
                    <View style={[orderFormStyle.inputContainer]}>
                        <TextInput style={orderFormStyle.textInput}
                            onChangeText={this._onChangePrice}
                            keyboardType={'numeric'}
                            value={number.putComma(price)}
                        />
                        <View style={orderFormStyle.inputTitleContainer}>
                            <Text style={orderFormStyle.inputTitle}>{`가격`}</Text>
                        </View>
                        {/* <View style={orderFormStyle.inputUnitContainer}>
                            <Text style={orderFormStyle.inputUnit}>{`${quoteSymbol}`}</Text>
                        </View> */}
                    </View>
                    <View style={[orderFormStyle.setPriceButtons]}>
                        <TouchableOpacity style={[orderFormStyle.minusButton, orderFormStyle.priceButton]} onPress={this._onPressDecreasePrice}>
                            <Text>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[orderFormStyle.plusButton, orderFormStyle.priceButton]} onPress={this._onPressIncreasePrice}>
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.fee, orderFormStyle.infoContainer]}>
                    <Text style={[styles.liquidTitle, orderFormStyle.infoTitle]}>총금액</Text>
                    <Text style={[styles.liquidContent, orderFormStyle.infoContent]}>{amount ? number.putComma(Decimal(amount).toFixed()) : '-'} {quoteSymbol}</Text>
                </View>
                {
                    this.props.userStore.isLoggedIn ?
                    <View style={[orderFormStyle.buttons]}>
                        <TouchableOpacity style={[orderFormStyle.button, orderFormStyle.initButton]} onPress={this._onPressInitPrice}>
                            <Text style={[orderFormStyle.buttonText]}>초기화</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[orderFormStyle.button, orderFormStyle.redButton]} onPress={this._onPressOrder}>
                            <Text style={[orderFormStyle.buttonText]}>매수</Text>
                        </TouchableOpacity>
                    </View>
                        :
                    <View style={[orderFormStyle.buttons]}>
                        <TouchableOpacity 
                            style={[
                                orderFormStyle.button,
                                orderFormStyle.blueButton
                            ]}
                            onPress={this._onPressLogin}
                        >
                            <Text style={[orderFormStyle.buttonText]}>로그인</Text>
                        </TouchableOpacity>
                    </View>
                }
                <View style={orderFormStyle.minorInfoRow}> 
                    <Text style={orderFormStyle.minorInfoRowText}
                    >최소주문금액
                    </Text>
                    <Text style={orderFormStyle.minorInfoRowText}>
                        {minimumOrderAmount ? number.putComma(Decimal(minimumOrderAmount).toFixed()) : '-' } {quoteSymbol}
                    </Text>
                </View>
                <View style={orderFormStyle.minorInfoRow}> 
                    <Text style={[orderFormStyle.minorInfoRowText]}>수수료 
                    </Text>
                    <Text style={[orderFormStyle.minorInfoRowText]}>{ this.maxFeePercentage ? number.putComma(Decimal(this.maxFeePercentage).toFixed()) : '-' } %
                    </Text>
                    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    maxFeePercentageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    maxFeePercentageContent: {
        fontSize: 12,
    },
    minimumOrderAmountContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    minimumOrderAmountContent: {
        fontSize: 12        
    }
});
