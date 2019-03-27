import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { observer } from 'mobx-react';
import TradingPairTableHeader from './TradingPairTableHeader';
import TradingPairTableBody from './TradingPairTableBody';

// @inject('')
@observer
class TradingPairTable extends Component {
    constructor(props) {
        super(props);
        this.dynamicColumnStyles = StyleSheet.create({
            [0]: { 
                flex: 1,
                justifyContent: 'flex-start',
                paddingLeft: 10,
            },
            [1]: { 
                flex: 1,        
                justifyContent: 'flex-end'
            },
            [2]: { 
                flex: 1,        
                justifyContent: 'flex-end'
            },
            [3]: { 
                flex: 1,
                justifyContent: 'flex-end',
                paddingRight: 10,
            },
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