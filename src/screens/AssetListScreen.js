import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';

// @inject('')
@observer
export default class AssetListScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '입출금',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
        };
    };

    render() {
        return (
            <View>
                <View></View>
                <Text> Deposit History </Text>
            </View>
        );
    };
}

const styles = StyleSheet.create({

})
