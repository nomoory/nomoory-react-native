import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import commonStyle from '../../styles/commonStyle'

@inject('tradingPairStore')
@observer
class TradingPareSearchBar extends Component {
    _onChangeSearchBar = (searchKeyword) => {
        this.props.tradingPairStore.setSearchKeyword(searchKeyword);
    }

    render() {
        return (
            <View style={[styles.container]}>
                <Image style={[styles.searchImage]}
                    source={require('../../../assets/images/exchange/icon_search.png')}
                />
                 <TextInput style={[styles.textInput]}
                    placeholder="코인명/심볼검색"
                    placeholderTextColor={commonStyle.color.mainThemeColor}
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
    },
    searchImage: {
        width: 25,
        height: 25,
        tintColor: commonStyle.color.mainThemeColor,
    },
    textInput: {
        fontSize: 14,
        height: '100%',
        flex: 1,
    }
})
export default TradingPareSearchBar;