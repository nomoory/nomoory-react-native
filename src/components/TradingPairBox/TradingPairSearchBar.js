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
                <View style={[styles.searchImageContainer]}>
                    <Image style={[styles.searchImage]}
                        style={{ width: 36, height: 36 }}
                        source={require('../../../assets/images/exchange/icon_search.png')}
                    />
                </View>
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
        height: 40,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',

        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#dedfe0',
    },
    searchImageContainer: {
        width: 50,
        justifyContent: 'center',
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