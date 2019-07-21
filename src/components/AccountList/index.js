import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View 
} from 'react-native';
import {
    inject,
    observer 
} from 'mobx-react';
import AccountItem from './AccountItem';
import Decimal from '../../utils/decimal';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('accountStore')
@observer
export default class AccountList extends Component {
    _filterAccounts = (accounts) => {
        if (!accounts) return [];
        if (accounts.length ===  0) return [];

        return accounts.filter((account, index) => {
            if (
                this.props.showPossesionOnly
                && Decimal(account.balance || 0).equals(0)
            ) {
                return false;
            }
            return true;
        });
    }
    
    render() {
        const { accounts } = this.props.accountStore;
        return (
            <View style={[styles.container]}>
                <View>
                    <FlatList 
                        style={[
                            styles.scrollViewContainer,
                            styles.itemsContainer
                        ]}
                        data={this._filterAccounts(accounts)}
                        // initialScrollIndex={8}
                        onEndReachedThreshold={1}
                        onEndReached={this._onEndReached}
                        // refreshing={this.state.refreshing}
                        // onRefresh={this.onRefresh}
                        enableEmptySections={true}
                        renderItem={({ item, index }) => {
                            return (
                                <AccountItem
                                    account={item}
                                />
                            );
                        }}
                        // emptyView={this._renderEmptyView}
                    />
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
