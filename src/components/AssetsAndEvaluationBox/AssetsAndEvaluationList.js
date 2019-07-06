import React, { Component } from 'react';
import { Text, StyleSheet, View, ScrollView, FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import commonStyle from '../../styles/commonStyle';

import AssetsAndEvaluationRow from './AssetsAndEvaluationRow';
import constants from '../../global/constants';

@inject('accountStore')
@observer
class AssetsAndEvaluationList extends Component {
    componentDidMount() {
        this.props.accountStore.loadAccounts()
    }
    
    _onEndReached = () => {

    }

    _renderEmptyView = () => {
        <Text style={[styles.noAssetText]}>
            현재 보유한 자산이 없습니다.
        </Text>
    }

    render() {
        const { portfolio } = this.props.accountStore.portfolio || {};
        return (
            <View style={ styles.container }>               
                <FlatList
                    data={portfolio.length ? portfolio : []}
                    // initialScrollIndex={8}
                    onEndReachedThreshold={1}
                    onEndReached={this._onEndReached}
                    // refreshing={this.state.refreshing}
                    // onRefresh={this.onRefresh}
                    enableEmptySections={true}
                    renderItem={({ item, index }) => {
                        return (
                            <AssetsAndEvaluationRow
                                key={ item.uuid }
                                portfolio={ item }
                            />
                        );
                    }}
                    emptyView={this._renderEmptyView}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
    },
    title: {
        padding: constants.style.padding
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    noAssetText: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: commonStyle.color.brandGrey,
    }
})

export default AssetsAndEvaluationList;
