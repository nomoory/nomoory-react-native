import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Clipboard, ActivityIndicator } from 'react-native';
import { inject, observer } from 'mobx-react';
import commonStyle from '../../styles/commonStyle';
import Decimal from '../../utils/decimal';
import number from '../../utils/number';

@inject('accountStore', 'modalStore')
@observer
export default class DepositBox extends Component {
    componentDidMount() {
        console.log('OrderBox is mounted |')
    }

    _handleIssueAddress = (e) => {
        this.props.accountStore.createAndGetWarmWalletAddress(this.props.accountStore.selectedAccountSymbol);
    }

    _setClipboardContent = (msg) => {
        Clipboard.setString(msg);
        this.props.modalStore.openModal({
            type: 'preset',
            title: '주소복사',
            content: '클립보드에 주소를 복사하였습니다.'
        });
    };

    _renderIssueAddress = () => {
        let account = this.props.accountStore.selectedAccount;
        let {
            asset_korean_name,
            asset_symbol,
        } = account || {};
        return (
            <View style={[styles.issueAddressContainer]}>
                <TouchableOpacity style={[styles.addAddressButton]}
                    onPress={ this.props.accountStore.isLoading ? () => {} : this._handleIssueAddress}>
                    {
                        this.props.accountStore.isLoading ?
                        <ActivityIndicator size="small" color={commonStyle.color.coblicPaleBlue}/> :
                        <Image
                            style={{ width: 46, height: 46 }}                                
                            source={require('../../../assets/images/depositWithdraw/ic_plus_big.png')}
                        />
                    }
                </TouchableOpacity>
                <View style={[styles.issueAddressDescription]}>
                    <Text style={[styles.issueAddressDescriptionText]}>
                    {`버튼을 클릭하시면,\n회원님 고유의 ${asset_korean_name}(${asset_symbol}) 입금주소가 발급됩니다.`}
                    </Text>
                </View>
            </View>
        );
    }

    _renderCopyAddress = (wallet_address) => {
        let account = this.props.accountStore.selectedAccount;
        let {
            asset_min_deposit_amount,
            asset_symbol
        } = account || {};

        return (
            <View style={[styles.copyAddressContainer]}>
                <View style={[styles.addressTextContainer]}>
                    <Text style={[styles.addressText]}
                        selectable={true}
                        onPress={() => this._setClipboardContent(wallet_address)}
                    >{wallet_address}
                    </Text>
                </View>
                {
                    (asset_min_deposit_amount && Decimal(asset_min_deposit_amount).toFixed() !== '0') ?
                    <View style={[styles.addressDescriptionContainer]}>
                        <Text style={[styles.addressDescriptionText]}>
                            {`* 최소입금금액은 ${number.putComma(Decimal(asset_min_deposit_amount).toFixed())} ${asset_symbol} 입니다.`}
                        </Text>
                    </View> :
                    null
                }
                <TouchableOpacity style={styles.copyAddressButton}
                    onPress={() => this._setClipboardContent(wallet_address)}
                >
                    <Text style={styles.copyAddressButtonText}>{`주소 복사하기`}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        let account = this.props.accountStore.selectedAccount || {};
        let {
            wallet_address,
            asset_korean_name,
            asset_symbol,
            asset_tx_required_confirmations
        } = account || {};

        // if (['KRW', 'TOKA'].includes(account.asset_symbol)) {
        //     // 현재 입금을 지원하지 않는 asset입니다.
        //     return (
        //         <View style={styles.container}>
        //         </View>
        //     );
        // } 

        return (
            <View style={styles.container}>
                <View style={[styles.descriptionContainer]}>
                    <Text style={[styles.descriptionText]}>
                        {`회원님에게 할당된 아래 주소로\n${asset_korean_name}(${asset_symbol})을 입금할 수 있습니다.`}
                    </Text>
                </View>
                <View style={[styles.addressContainer]}>
                    <View style={[styles.addressHeaderContainer]}>
                        <Text style={[styles.addressHeaderText]}>
                            {`나의 ${asset_korean_name} 입금주소`}
                        </Text>
                    </View>

                    { /* 입금 오픈시 */
                        wallet_address ?
                        this._renderCopyAddress(wallet_address.address) :
                        this._renderIssueAddress()
                    }
                    { /* 입금방지 입금금지 입금정지 입금 방지 입금 금지 입금 정지 */
                        /*
                            <View className='address-content-container'>
                                <View className='title' style={{fontSize: 20, fontWeight: 'bold', paddingTop: 36, paddingBottom: 0}}>입금 일시 정지</View>
                                <View className='add-address-description'>
                                    현재 너무 많은 입금이 들어오고 있습니다. <br/>트래픽 분산을 위해 입금을 일시적으로 중지합니다.
                                </View>
                            </View>
                        */
                    }
                </View>
                <View style={[styles.noticeContainer]}>
                    <View style={[styles.noticeTitleContainer]}>
                        <Text style={[styles.noticeTitleText, styles.grey]}>입금 전 꼭 알아두세요!</Text>
                    </View>
                    <View style={[styles.noticeContentContainer]}>
                        <Text style={[styles.grey]}>{`- 위 주소로는 ${asset_korean_name}(${asset_symbol})만 입금 가능합니다. \n- 해당 주소로 다른 암호화폐를 입금 시도할 경우에 발생할 수 있는 오류/손실은 복구가 불가능합니다.`}</Text>
                        <Text style={[styles.grey]}>- {`${asset_tx_required_confirmations || '-'}`}번 의 confirmation이 발생한 이후 계좌에 반영되며, 이 과정은 약 10~30분 정도 걸립니다.</Text>
                        <Text style={[styles.grey]}>- 위 주소는 입금전용 주소입니다. </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    descriptionContainer: {
        padding: 15,
        // paddingTop: 12,
        // paddingBottom: 12,
        
        justifyContent: 'center',
        alignItems: 'center',

        borderBottomWidth: 1,
        borderBottomColor: '#dedfe0',
    },
    descriptionText: {
        fontSize: 16,
        textAlign: 'center'
    },
    addressContainer: {
        padding: 15,
        flexDirection: 'column',
        alignItems: 'center',    

        borderBottomWidth: 1,
        borderBottomColor: '#dedfe0',
    },
    addressHeaderContainer: {
        width: '100%'
    },
    addressHeaderText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333333'
    },


    // issueAddressContainer
    issueAddressContainer: {
        flexDirection: 'column',
        alignItems: 'center',

    },
    addAddressButton: {
        marginTop: 22,
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: commonStyle.color.coblicBlue,
        justifyContent: 'center',
        alignItems: 'center'
    },
    issueAddressDescription: {
        marginTop: 20,
        width: '100%'
    },
    issueAddressDescriptionText: {
        textAlign: 'center'
    },
    noticeContainer: {
        marginTop: 14,
        paddingLeft: 15,
        paddingRight: 15,
    },
    noticeTitleText: {
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 8,
    },
    grey: {
        color: commonStyle.color.grey
    },

    copyAddressContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    addressTextContainer: {
        marginTop: 18,
        padding: 16,
        paddingTop: 10,
        paddingBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: commonStyle.color.coblicPaleGrey,
        borderWidth: 1,
    },    
    addressText: {
        fontWeight: '400',
        fontSize: 14,
    },
    addressDescriptionContainer: {
        marginTop: 4,
    },
    addressDescriptionText: {
        fontSize: 11,
        color: '#333333',
    },
    copyAddressButton: {
        marginTop: 14,
        marginBottom: 4,
        height: 46,
        width: 146,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: commonStyle.color.coblicBlue,
    },
    copyAddressButtonText: {
        fontWeight: '600',
        fontSize: 15,
        color: 'white'
    }
});
