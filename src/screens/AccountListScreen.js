import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Container } from 'native-base';
import { action, observable } from 'mobx';
import number from '../utils/number';
import Decimal from '../utils/decimal';
import commonStyle, { color, font } from '../styles';
import AccountList from '../components/AccountList';

@inject('accountStore')
@observer
export default class AccountListScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '입출금',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
        };
    };

    @observable showPossesionOnly = false;
    @action _handleChnageFilterCheckBox = (e) => {  
        console.log(this.showPossesionOnly)
        this.showPossesionOnly = !this.showPossesionOnly;    
    }

    render() {
        let { totalAssetsEvaluation } = this.props.accountStore;
        return (
            <Container style={[styles.container]}>
                <View style={[styles['totalEvaluatedPriceContainer']]}>
                    <Text style={[styles['title']]}>총 보유자산</Text>
                    <View style={[styles['priceContainer']]}>
                        <Text style={[styles['price']]}>
                            {number.putComma(Decimal(totalAssetsEvaluation.total_evaluated_price_in_quote).toFixed(0))}
                        </Text>
                        <Text style={[styles['unit']]}>KRW</Text>
                    </View>
                </View>
                <View style={[styles['searchContainer']]}>
                    <View style={[styles['searchbarContainer']]}> 
                        {/* <CoinSearchBar
                            searchBarType={SEARCHBAR_TYPES.ACCOUNT}
                        /> */}
                    </View>
                    <TouchableOpacity style={[ styles['checkboxContainer'] ]}
                        onPress={this._handleChnageFilterCheckBox}
                    >
                        <View style={[
                            styles.checkBox,
                            this.showPossesionOnly && styles.checked
                        ]}>
                            <Image
                                style={{ width: 10, height: 6.6 }}
                                source={require('../../assets/images/depositWithdraw/ic_check_small.png')}
                            />
                        </View>
                        <Text style={[styles.checkboxText]}>보유코인</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles['accountListContainer']]}>
                    <AccountList showPossesionOnly={this.showPossesionOnly}/>
                </View>
            </Container>
        );
    };
}

const padding = 15;
const height = 70;
const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flexDirection: 'column',
    },
    totalEvaluatedPriceContainer: {
        width: '100%',
        flexDirection: 'row',
        height,
        padding,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    priceContainer: {
        flexDirection: 'row'
    },
    searchContainer: {
        height,
        padding,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: color.coblicGrey,
        backgroundColor: color.white,
    },
    checkboxText: {
        fontSize: 16,
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
