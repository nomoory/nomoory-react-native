import React, { Component } from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import AccountItem from './AccountItem';
import Decimal from '../../utils/decimal';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('accountStore')
@observer
export default class AccountList extends Component {
    _renderAccountList() {
        const { accounts } = this.props.accountStore;

        return accounts.map((account, index) => {
            if (
                this.props.showPossesionOnly
                && Decimal(account.balance || 0).equals(0)
            ) {
                return null;
            }
            if (
                this.props.showDepositableOnly && 
                !account.is_depositable
            ) {
                return null;
            }
            return ( <AccountItem key={index} account={account} /> );
        });
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View>
                    <ScrollView style={[styles.scrollViewContainer]}>
                        <View style={[styles.itemsContainer]}>
                            {this._renderAccountList()}
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
    },
    header: {
        flexDirection: 'row'
    },
    scrollViewContainer: {
        height: '100%'
    }

})
