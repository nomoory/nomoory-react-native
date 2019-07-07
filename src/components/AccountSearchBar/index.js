import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import commonStyle from '../../styles/commonStyle';

const searchUiColor = commonStyle.color.fontTextColor;

@inject('accountStore')
@observer
export default class AccountSearchBar extends Component {
    _onChangeSearchBar = (searchKeyword) => {
        this.props.accountStore.updateSearchKeyword(searchKeyword);
    }

    render() {
        return (
            <View style={[styles.container]}>
                <Image
                    style={[styles.searchImage]}
                    source={require('../../../assets/images/exchange/icon_search.png')}
                />
                 <TextInput
                    style={[styles.textInput]}
                    placeholder="코인명/심볼검색"
                    placeholderTextColor={searchUiColor}
                    onChangeText={this._onChangeSearchBar} 
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 38,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',

        borderBottomWidth: 1,
        borderBottomColor: searchUiColor,
    },
    searchImage: {
        width: 30,
        height: 30,
        tintColor: searchUiColor,
    },
    textInput: {
        fontSize: 14,
        height: '100%',
        color: searchUiColor,
        flex: 1,
    }
})
