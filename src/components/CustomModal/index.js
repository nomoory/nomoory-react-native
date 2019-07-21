import React, { Component } from 'react';
import { color, font } from '../../styles/commonStyle';
import { StyleSheet, TouchableWithoutFeedback, View, BackHandler} from 'react-native';
import Modal from "react-native-modal";
import { inject, observer } from 'mobx-react';

@inject('modalStore')
@observer
export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        // BackHandler.addEventListener('hardwareBackPress', this._handleBackPress)
        console.log('custom construct')
    }

    componentWillUnmount() {
        console.log('custom unmount')
        // BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress)
    }

    _handleBackPress = () => {
        console.log('custom closeModal')
        // if (this.props.modalStore.customModal.isVisible) {
        //     this._closeModal();
        // }
    }

    _closeModal = () => {
        this.props.modalStore.closeCustomModal();
        this.props.modalStore.customModal.onClose();
    }

    render() {
        let { 
            modal,
            isVisible,
            config,
        } = this.props.modalStore.customModal || {};
        
        return (
            <Modal 
                isVisible={isVisible}
                onBackdropPress={this._closeModal}
                animationIn={config.animationIn || 'slideInRight'}
                animationOut={config.animationOut || 'slideOutRight'}
                animationInTiming={200}
                animationOutTiming={200}
            >
                <TouchableWithoutFeedback
                    onPress={this._closeModal}
                >
                    <View
                        style={styles.transparentContainer}
                    >
                        {modal}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    transparentContainer: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});