import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Input } from 'native-base';

@inject('accountStore')
@observer
export default class DepositBox extends Component {
    componentDidMount() {
        console.log('OrderBox is mounted |')
    }
    _handleCopyAddress = (address) => (e) => {
        let element = document.getElementById('token-address');
        element.select()
        document.execCommand("copy");
        alert('주소를 복사하였습니다.')
    }
    _handleIssueAddress = (e) => {
        this.props.accountStore.createAndGetWarmWalletAddress(this.props.accountStore.selectedAccountSymbol);
    }
    _renderIssueAddress = () => {
        let account = this.props.accountStore.selectedAccount;
        let {
            asset_korean_name,
            asset_symbol,
        } = account || {};
        return (
            <View style={[styles.addressContainer]}>
                <TouchableOpacity style={[styles.addAddressButton]}
                    onPress={this._handleIssueAddress}>
                    <Image
                        style={{ width: 46, height: 46 }}                                
                        source={require('../../../assets/images/depositWithdraw/ic_plus_big.png')}
                    />
                </TouchableOpacity>
                <View style={[styles.addAddressDescription]}>
                    <Text>
                    {`버튼을 클릭하시면,
                    회원님 고유의 ${asset_korean_name}(${asset_symbol}) 입금주소가 발급됩니다.`}
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
            <View className='address-content-container'>
                {/* <Input className='address' 
              type='text' 
              value={`${wallet_address}`} 
              id="token-address" 
              readOnly
            /> */}
                {
                    (asset_min_deposit_amount && Decimal(asset_min_deposit_amount).toFixed() !== '0') &&
                    <View className="asset-min-deposit-amount">
                        <Text>
                            {`* 최소입금금액은 ${asset_min_deposit_amount ? Decimal(asset_min_deposit_amount).toFixed() : '-'} ${asset_symbol} 입니다.`}
                        </Text>
                    </View>
                }
                <TouchableOpacity className='copy-address-button coblic-blue-button'
                    onPress={this._handleCopyAddress(wallet_address)}
                >
                    <Text>{`주소 복사하기`}</Text>
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
        console.log(account)

        if (['KRW', 'CT'].includes(this.props.accountStore.selectedAccountSymbol)) {
            // 현재 입금을 지원하지 않는 asset입니다.
            return (
                <View style={styles.container}>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={[styles.descriptionContainer]}>
                        <Text style={[styles.descriptionText]}>
                            {`회원님에게 할당된 아래 주소로 ${asset_korean_name}(${asset_symbol})을 입금할 수 있습니다.`}
                        </Text>
                    </View>
                    <View className='address-container'>
                        <View className='title-container'>
                            <Text>
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
                    <View className='notice-container'>
                        <View className='title'>
                            <Text>입금 전 꼭 알아두세요!</Text>
                        </View>
                        <View className='notice'>
                            <Text>{`- 위 주소로는 ${asset_korean_name}(${asset_symbol})만 입금 가능합니다. 해당 주소로 다른 암호화폐를 입금 시도할 경우에 발생할 수 있는 오류/손실은 복구가 불가능합니다.`}</Text>
                            <Text>- {`${asset_tx_required_confirmations || '-'}`}번 의 confirmation이 발생한 이후 계좌에 반영되며, 이 과정은 약 10~30분 정도 걸립니다.</Text>
                            <Text>- 위 주소는 입금전용 주소입니다. </Text>
                        </View>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    descriptionContainer: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressContainer: {
        flexDirection: 'center',
        alignItems: 'center',        
    },
    addAddressButton: {
        backgroundColor: 'blue'
    }
});