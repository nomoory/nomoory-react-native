import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';
import number from '../utils/number';
import Decimal from '../utils/decimal';
import commonStyle, { color, font } from '../styles/commonStyle';
import headerStyle from '../styles/headerStyle';
import AccountList from '../components/AccountList';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('accountStore', 'userStore')
@observer
export default class AccountListScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '입금',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
            ...headerStyle.white
        };
    };
    componentDidMount() {
        if (!this.props.userStore.isLoggedIn) {
            this.props.navigation.navigate('Login', {
                from: 'Accounts'
            });
        }
    }
    

    @observable showPossesionOnly = false;
    @action _handleChangeFilterCheckBox = (e) => {  
        this.showPossesionOnly = !this.showPossesionOnly;    
    }

    @observable showDepositableOnly = false;
    @action _handleToggleDepositableFilterCheckBox = (e) => {  
        this.showDepositableOnly = !this.showDepositableOnly;    
    }

    render() {
        let { total_evaluated_price_in_quote } = this.props.accountStore.totalAssetsEvaluation || {};
        return (
            <View style={[styles.container]}>
                <View style={[styles.totalEvaluatedPriceContainer]}>
                    <Text style={[styles.title]}>총보유자산</Text>
                    <View style={[styles['priceContainer']]}>
                        <Text style={[styles['price']]}>
                            {total_evaluated_price_in_quote ? number.putComma(Decimal(total_evaluated_price_in_quote).toFixed(0)) : '-'} KRW
                        </Text>
                    </View>
                </View>
                <View style={[styles.searchContainer]}>
                    <View style={[styles['searchbarContainer']]}> 
                        {/* <CoinSearchBar
                            searchBarType={SEARCHBAR_TYPES.ACCOUNT}
                        /> */}
                    </View>
                    <TouchableOpacity style={[ styles['checkboxContainer'] ]}
                        onPress={this._handleToggleDepositableFilterCheckBox}
                    >
                        <View style={[
                            styles.checkBox,
                            this.showDepositableOnly && styles.checked
                        ]}>
                            <Image
                                style={{ height: 6, resizeMode: 'contain' }}
                                source={require('../../assets/images/depositWithdraw/ic_check_small.png')}
                            />
                        </View>
                        <Text style={[styles.checkboxText]}>입금가능만</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[ styles['checkboxContainer'] ]}
                        onPress={this._handleChangeFilterCheckBox}
                    >
                        <View style={[
                            styles.checkBox,
                            this.showPossesionOnly && styles.checked
                        ]}>
                            <Image
                                style={{ height: 6, resizeMode: 'contain' }}
                                source={require('../../assets/images/depositWithdraw/ic_check_small.png')}
                            />
                        </View>
                        <Text style={[styles.checkboxText]}>보유코인만</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles['accountListContainer']]}>
                    <AccountList showPossesionOnly={this.showPossesionOnly} showDepositableOnly={this.showDepositableOnly}/>
                </View>
            </View>
        );
    };
}

const padding = 15;
const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    totalEvaluatedPriceContainer: {
        width: '100%',
        flexDirection: 'row',
        height: 60,
        padding,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f7f8fa',
    },
    priceContainer: {
        flexDirection: 'row'
    },
    title: {
        fontWeight: '500',
        fontSize: 16,
        color: '#333333',
    },
    price: {
        fontWeight: '600',
        fontSize: 16,
    },

    searchContainer: {
        height: 46,
        padding,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#dedfe0'
    },
    searchbarContainer: {
    },

    checkboxContainer: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    checkBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 13,
        height: 13,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: color.coblicPaleGrey,
        backgroundColor: color.white,
        marginRight: 4,
        marginLeft: 10,
    },
    checkboxText: {
        fontSize: 13,
    },
    checked: {
        backgroundColor: color.coblicBlue,
        borderColor: color.coblicBlue,
    },
    accountListContainer: {
        flex: 1,
        width: '100%'
    }
})
