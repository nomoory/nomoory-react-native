import React, { Component } from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { Container } from 'native-base';
import { inject, observer } from 'mobx-react';
import AccountItem from './AccountItem';
import Decimal from '../../utils/decimal';

@inject('accountStore')
@observer
export default class AccountList extends Component {
    constructor(props) {
        super(props);
        // this.pubnubChannel = "";
    }
    componentDidMount() {
        // this.props.pubnub.subscribe(this.pubnubChannel);
    }
    componentWillUnmount() {
        // this.props.pubnub.unsubscribe(this.pubnubChannel);
    }
    _renderAccountList() {
        const { accounts } = this.props.accountStore;

        return accounts.map((account, index) => {
            if (this.props.showPossesionOnly && Decimal(account.balance || 0).equals(0)) {
                return null;
            } else {
                return ( <AccountItem key={index} account={account} /> );
            }
        });
    }

    render() {
        console.log('accounts', this.props.accountStore.accounts)
        return (
            <Container style={[styles.container]}>
                <View>
                    {/* <View style={styles.header}>
                        <View style={[styles.test]}><Text style={[styles.test]}>코인명</Text></View>
                        <View style={[styles.test]}><Text style={[styles.test]}>보유수량(평가금액)</Text></View>
                        <View style={[styles.test]}><Text style={[styles.test]}>보유비중</Text></View>
                    </View> */}
                    <ScrollView style={[styles.scrollViewContainer]}>
                        <View style={[styles.itemsContainer]}>
                            {this._renderAccountList()}
                        </View>
                    </ScrollView>
                </View>
            </Container>
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
