import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { computed, reaction } from 'mobx';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';
import TRANSLATIONS from '../../TRANSLATIONS';
import { withNavigation } from 'react-navigation';
// https://www.npmjs.com/package/react-native-modal-dropdown
import ModalDropdown from 'react-native-modal-dropdown';
import MiniRealtimeTradeHistory from '../MiniRealtimeTradeHistory';

const OPTIONS = [
    '최대',
    '50%',
    '25%',
    '10%',
];

@withNavigation
@inject('tradingPairStore', 'orderStore', 'accountStore', 'userStore', 'modalStore')
@observer
export default class BuyOrderForm extends Component {
    selectedIndex = -1;

    constructor(props) {
        super(props);
        this.volumeReaction = reaction(
            () => props.orderStore.values.volume,
            volume => {
                // 정수부 자리수가 3의 배수일때 ,가 추가되므로 현재 있던 위치에서 뒤로 한칸
                if (
                    this.volumeInputRef
                    && volume && this.volume
                    && this.volume.length < volume.length
                    && Decimal(volume.split('.')[0]).toFixed().length % 3 === 1
                ) {
                    const nextSelection = this.volumeInputRef._lastNativeSelection.start + 2 || 0;

                    this.volumeInputRef.setNativeProps({
                        selection: {
                            start: nextSelection,
                            end: nextSelection,
                        }
                    })
                }
                this.volume = volume; 
            }
        );

        this.priceReaction = reaction(
            () => props.orderStore.values.price,
            price => {
                // 정수부 자리수가 3의 배수일때 ,가 추가되므로 현재 있던 위치에서 뒤로 한칸
                if (
                    this.priceInputRef
                    && price && this.price
                    && this.price.length < price.length
                    && Decimal(price.split('.')[0]).toFixed().length % 3 === 1
                ) {
                    const nextSelection = this.priceInputRef._lastNativeSelection.start + 2 || 0;

                    this.priceInputRef.setNativeProps({
                        selection: {
                            start: nextSelection,
                            end: nextSelection,
                        }
                    })
                }     
                this.price = price;       
            }
        )

        this.amountReaction = reaction(
            () => props.orderStore.values.amount,
            amount => {
                // 정수부 자리수가 3의 배수일때 ,가 추가되므로 현재 있던 위치에서 뒤로 한칸
                if (
                    this.amountInputRef
                    && amount && this.amount
                    && this.amount.length < amount.length
                    && Decimal(amount.split('.')[0]).toFixed().length % 3 === 1
                ) {
                    const nextSelection = this.amountInputRef._lastNativeSelection.start + 2 || 0;

                    this.amountInputRef.setNativeProps({
                        selection: {
                            start: nextSelection,
                            end: nextSelection,
                        }
                    })
                }     
                this.amount = amount;
            }
        )
    }
    componentWillUnmount() {
        if (this.volumeReaction) this.volumeReaction();
        if (this.priceReaction) this.priceReaction();
        if (this.amountReaction) this.amountReaction();
    }

    componentDidMount() {
        this.props.orderStore.setSide('BUY'); // BUY side임을 보장하기 위함
    }

    @computed
    get maxFeePercentage() {
        return number.getRateAsFiexdPercentage(this.props.orderStore.maxFeeRate, 2);
    }

    _onChangePrice = (text = '') => {
        this._resetSelection();
        this.props.orderStore.setPriceFromInput(text.split(',').join(''));
    }

    _onChangeVolume = (text = '') => {
        this._resetSelection();
        this.props.orderStore.setVolumeFromInput(text.split(',').join(''));
    }

    _onChangeAmount = (text = '') => {
        this._resetSelection();
        this.props.orderStore.setAmount(text.split(',').join(''));
    }

    _resetSelection = () => {
        if (this.selectedIndex !== -1) {
            this.selectedIndex = -1;
            if (this.dropdown) this.dropdown.select(-1);    
        }
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
            });
        } else {
            try {
                this.props.modalStore.openModal({
                    title: '주문 확인',
                    content: () => <Text style={{
                        textAlign: 'center',
                        fontSize: 16,
                        height: 160,
                    }}>
                        {`
거래자산 : ${baseSymbol}/${quoteSymbol}
구매가격 : ${number.putComma(price)} ${quoteSymbol}
구매수량 : ${number.putComma(volume)} ${baseSymbol}\n
총금액 : ${number.putComma(number.getFixedPrice(amount, quoteSymbol))} ${quoteSymbol}
                    `}</Text>,
                    buttons: [
                        {
                            title: '취소',
                            onPress: () => {
                                this.props.modalStore.closeModal()
                            }
                        }, {
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
    _onPressIncreasePrice = (e) => {
        this._resetSelection();
        this.props.orderStore.increasePriceByButton();
    }
    _onPressDecreasePrice = (e) => {
        this._resetSelection();
        this.props.orderStore.decreasePriceByButton();
    }
    _onPressSetVolumeByRate = (rate) => {
        if (this.props.userStore.isLoggedIn) {
            this.props.orderStore.setVolumeByRate(rate);
        }
    }
    _onPressInitPrice = (e) => {
        this._resetSelection();
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
        const targetAccount = this.props.accountStore.getAccountByAssetSymbol(quoteSymbol) || {}
        const orderFormStyle = this.props.orderFormStyle;
        const selectedText = OPTIONS[this.selectedIndex] || '가능';
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
                <View
                    style={[orderFormStyle.volumeRow]}
                >
                    <View style={[orderFormStyle.volumeInputContainer]}>
                        <TextInput
                            style={orderFormStyle.textInput}
                            ref={(ref) => { this.volumeInputRef = ref; }}
                            onChangeText={this._onChangeVolume}
                            keyboardType={'numeric'}
                            value={number.putComma(volume)}
                            onBlur={() => {
                                this.props.orderStore.makeVolumeClean();
                            }}
                        />
                        <View style={orderFormStyle.inputTitleContainer}>
                            <Text style={orderFormStyle.inputTitle}>{`수량`}</Text>
                        </View>
                    </View>
                    <View>
                        <ModalDropdown
                            ref={(ref) => { this.dropdown = ref; }}
                            dropdownStyle={
                                orderFormStyle.dropdownStyle
                            }
                            // defaultValue="가능"
                            options={OPTIONS}
                            renderRow={(option, index, isSelected) => {
                                return (
                                    <View
                                        style={[orderFormStyle.setVolumeButton]}
                                    >
                                        <Text style={
                                            orderFormStyle.setVolumeButtonText
                                        }>
                                            {option}
                                        </Text>
                                    </View>
                                );
                            }}
                            adjustFrame={(style) => {
                                let adjustedStyle = { ...style };
                                adjustedStyle.top = adjustedStyle.top - 24;
                                return adjustedStyle;
                            }}
                            onSelect={(index, value) => {
                                this.selectedIndex = index;
                                const rate = value === '최대' ? 1 : +value.split('%')[0] / 100;
                                this._onPressSetVolumeByRate(rate);
                            }}
                        >
                            <TouchableOpacity
                                style={orderFormStyle.volumeButton}
                                // style={[orderFormStyle.minusButton, orderFormStyle.priceButton]} 
                                onPress={() => { 
                                    this.dropdown.show();
                                }}>
                                <Text>{selectedText}</Text>
                            </TouchableOpacity>
                        </ModalDropdown>
                    </View>
                </View>
                <View style={[orderFormStyle.priceInputContiner]}>
                    <View style={[orderFormStyle.inputContainer]}>
                        <TextInput
                            style={orderFormStyle.textInput}
                            ref={(ref) => { this.priceInputRef = ref; }}
                            onChangeText={this._onChangePrice}
                            keyboardType={'numeric'}
                            value={number.putComma(price)}
                            onBlur={() => {
                                this.props.orderStore.makePriceClean();
                            }}
                        />
                        <View style={orderFormStyle.inputTitleContainer}>
                            <Text style={orderFormStyle.inputTitle}>{`가격`}</Text>
                        </View>
                    </View>
                    <View style={[orderFormStyle.setPriceButtons]}>
                        <TouchableOpacity 
                            style={[
                                orderFormStyle.minusButton,
                                orderFormStyle.priceButton
                            ]} 
                            onPress={this._onPressDecreasePrice}>
                            <Text>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                orderFormStyle.plusButton,
                                orderFormStyle.priceButton
                            ]}
                            onPress={this._onPressIncreasePrice}>
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[orderFormStyle.amountContainer]}>
                    <View style={[orderFormStyle.inputContainer]}>
                        <TextInput
                            style={orderFormStyle.textInput}
                            ref={(ref) => { this.amountInputRef = ref; }}
                            onChangeText={this._onChangeAmount}
                            keyboardType={'numeric'}
                            value={number.putComma(amount)}
                            onBlur={() => {
                                this.props.orderStore.makeAmountClean();
                            }}
                        />
                        <View style={orderFormStyle.inputTitleContainer}>
                            <Text style={orderFormStyle.inputTitle}>총금액</Text>
                        </View>
                    </View>
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
                <View style={orderFormStyle.minorInfoRows}>
                    <View style={orderFormStyle.minorInfoRow}>
                        <Text style={orderFormStyle.minorInfoRowText}
                        >최소주문금액
                        </Text>
                        <Text style={orderFormStyle.minorInfoRowText}>
                            {minimumOrderAmount ? number.putComma(Decimal(minimumOrderAmount).toFixed()) : '-'} {quoteSymbol}
                        </Text>
                    </View>
                    <View style={orderFormStyle.minorInfoRow}>
                        <Text style={[orderFormStyle.minorInfoRowText]}>수수료
                        </Text>
                        <Text style={[orderFormStyle.minorInfoRowText]}>{this.maxFeePercentage ? number.putComma(Decimal(this.maxFeePercentage).toFixed()) : '-'} %
                        </Text>
                    </View>
                </View>                
                <MiniRealtimeTradeHistory />
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
