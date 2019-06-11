import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import { inject, observer } from 'mobx-react';

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
                    style={{ width: 36, height: 36 }}
                    source={require('../../../assets/images/exchange/icon_search.png')}
                />
                 <TextInput style={[styles.textInput]}
                    placeholder="코인명/심볼검색"
                    onChangeText={this._onChangeSearchBar} 
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        height: 44,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchImage: {
        width: 50,
    },
    textInput: {
        fontSize: 16,
        height: '100%',
        flex: 1
    }
})
export default TradingPareSearchBar;