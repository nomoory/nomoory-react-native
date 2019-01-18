import React, { Component } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import commonStyle from '../../styles/commonStyle';

import AssetsAndEvaluationRow from './AssetsAndEvaluationRow';
import constants from '../../global/constants';

@inject('accountStore')
@observer
class AssetsAndEvaluationList extends Component {
    constructor(props) {
        super(props);
        // this.pubnubChannel = "";
    }

    render() {
        const { portfolio } = this.props.accountStore.portfolio || {};
        const accountList = portfolio.map(
            portfolio => (
                <AssetsAndEvaluationRow key={ portfolio.uuid } portfolio={ portfolio } />
            )
        );
        return (
            <View style={ styles.container }>
                {/* <View style={ styles.header }>
                    <Text style={ styles.title }>보유 자산별 손익</Text>
                </View> */}
                <ScrollView>
                    {   
                        accountList.length > 0 ?
                        accountList :
                        <Text style={[styles.noAssetText]}>
                            현재 보유한 자산이 없습니다.
                        </Text>
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',  
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
        color: commonStyle.color.coblicGrey,
    }
})

export default AssetsAndEvaluationList;
