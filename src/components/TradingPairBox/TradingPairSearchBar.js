import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Form, Input, Item, Label } from 'native-base';
import { inject, observer } from 'mobx-react';

@inject('tradingPairStore')
@observer
class TradingPareSearchBar extends Component {
    _onChangeSearchBar = (searchKeyword) => {
        this.props.tradingPairStore.setSearchKeyword(searchKeyword);
    }

    render() {
        return (
            <View style={this.props.style || styles.container}>
                <TextInput 
                    placeholder="코인명/심볼검색"
                    onChangeText={this._onChangeSearchBar} 
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: 'white'
    },
})
export default TradingPareSearchBar;