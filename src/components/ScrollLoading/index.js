import React, { Component } from 'react';
import commonStyles, { font }from '../../styles/commonStyle';
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
                {this.props.isLoadable.message_code === 'no_data' &&
                    <View>
                        <Text className='coblic-centered-text-container' style={[ styles.textContainer ]}>
                            불러올 데이터가 없습니다.
                        </Text>
                    </View>
                }
                {this.props.isLoadable.message_code === 'no_more_load' &&
                     <View>
                        <Text className='coblic-centered-text-container' style={[styles.textContainer]}>
                            더 이상 불러올 데이터가 없습니다.
                        </Text>
                    </View>
                }
                {this.props.isLoading &&
                    <ActivityIndicator size="large" color={commonStyles.color.coblicPaleBlue}/>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column'
    },
    textContainer: {
        height: 80
    }
});