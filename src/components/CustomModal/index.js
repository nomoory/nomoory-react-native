import React, { Component } from 'react';
import { color, font } from '../../styles/commonStyle';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Modal from "react-native-modal";
import { inject, observer } from 'mobx-react';

@inject('modalStore')
@observer
export default class CommonModal extends Component {
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