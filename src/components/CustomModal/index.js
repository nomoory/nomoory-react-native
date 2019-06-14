import React, { Component } from 'react';
import { color, font } from '../../styles/commonStyle';
import { StyleSheet, Button, Text, View, ScrollView, TouchableOpacity } from 'react-native';
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
                <View 
                    onPress={this._closeModal}
                    style={[styles.transparentContainer]}
                >
                    {modal}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    transparentContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
});