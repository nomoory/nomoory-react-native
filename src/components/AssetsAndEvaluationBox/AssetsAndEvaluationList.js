import React, { Component } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';

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
                    { accountList }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    bodyLeft: {
    },
    bodyRight: {
    }
})

export default AssetsAndEvaluationList;
