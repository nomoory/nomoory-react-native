import React, { Component } from 'react';
import {
    StyleSheet,
    Button,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { } from 'native-base';
import {
    inject,
    observer
} from 'mobx-react';
import { observable } from 'mobx';
import TradingPairTableHeader from './TradingPairTableHeader';
import TradingPairTableBody from './TradingPairTableBody';

// @inject('')
@observer
class TradingPairTable extends Component {
    constructor(props) {
        super(props);
        this.dynamicColumnStyles = StyleSheet.create({
            [0]: { flex: 2 },
            [1]: { flex: 1 },
            [2]: { flex: 1 },
            [3]: { flex: 1 },
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TradingPairTableHeader columStyles={this.dynamicColumnStyles} />
                <TradingPairTableBody columStyles={this.dynamicColumnStyles} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
})
export default TradingPairTable;