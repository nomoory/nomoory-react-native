import React, { Component } from 'react';
import commonStyle, { font }from '../../styles/commonStyle';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text } from 'react-native';

export default class ScrollLoading extends Component {
    constructor(props) {
        super(props);
        this.loadingRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.loadingRef.current) {
            // this.loadingRef.parentNode.style.position = 'relative';
            this.loadingRef.current.parentNode.style.position = 'relative';
        }
    }

    componentWillUnmount() {
        try {
            this.loadingRef.current.parentNode.style.position = 'initial';
        } catch (e) {

        }
    }
    render() {
        return (
            <View style={[this.props.style, styles.container, this.props.isIndividual ? styles.individual : {}]} 
                // ref={this.loadingRef}
                // onClick={(e) => { e.stopPropagation() }}
            >
                <View style={[ styles.contentContainer ]}>
                    {
                        this.props.isLoadable.message_code === 'no_data' &&
                        <Text style={[ styles.notificationText ]}>
                            불러올 데이터가 없습니다.
                        </Text>
                    }
                    {
                        this.props.isLoadable.message_code === 'no_more_load' &&
                        <Text style={[styles.notificationText]}>
                            더 이상 불러올 데이터가 없습니다.
                        </Text>
                    }
                    {
                        this.props.isLoading &&
                        <ActivityIndicator size="large" color={commonStyle.color.brandPaleBlue}/>
                    }
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    contentContainer: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    notificationText: {
        color: commonStyle.color.brandGrey,
        fontSize: 15
    }
});