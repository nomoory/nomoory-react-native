import React, { Component } from 'react';
import commonStyle from '../styles/commonStyle';
import headerStyle from '../styles/headerStyle';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { QUOTE_SYMBOL } from '../stores/accountStore';
import DepositWithdrawInfoHeader from '../components/DepositWithdrawInfoHeader';
import DepositBox from '../components/DepositBox';
import { ScrollView } from 'react-native-gesture-handler';
import * as Icon from '@expo/vector-icons';

@inject('accountStore')
@observer
export default class AccountDepositWithdrawScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        this.currency= navigation.getParam('currency', '');

        return {

            headerLeft: (
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Accounts');
                        }}
                    >
                        <Icon.AntDesign
                            name="left"
                            size={30} color={commonStyle.color.headerTextColor}
                        // style={styles.favoriteIcon}
                        />
                    </TouchableOpacity>
                    <Text
                        style={styles.headerText}
                        maxFontSizeMultiplier={20}
                        allowFontScaling={false}
                    >
                        {`${this.currency} 입출금`}
                    </Text>
                </View>
            ),
            ...headerStyle.white
        };
    };
    render() {

        return (
            <ScrollView style={styles.container}>
                <DepositWithdrawInfoHeader />
                <DepositBox />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        color: commonStyle.color.headerTextColor
    },
    container: {
        width: '100%',
        height: '100%',

        flexDirection: 'column',
        backgroundColor: 'white'
    },
})
