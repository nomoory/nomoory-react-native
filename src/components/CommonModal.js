import React, { Component } from 'react';
import { color, font } from '../styles';
import { StyleSheet, Button, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { inject, observer } from 'mobx-react';

@inject('modalStore')
@observer
class CommonModal extends Component {
    _closeModal = () => this.props.modalStore.closeModal();

    render() {
        let { 
            isVisible, 
            type, 
            title, 
            content, 
            buttons 
        } = this.props.modalStore || {};
        
        console.log(typeof buttons);
        return (
            <Modal isVisible={isVisible}
                onBackdropPress={this._closeModal}
                animationIn='slideInRight'
                animationOut='slideOutRight'
                animationInTiming={200}
                animationOutTiming={200}
            >
                <View 
                    onPress={this._closeModal}
                    style={[styles.transparentContainer]}
                >
                    <View style={[styles.container]}>
                        <View style={[styles.headerContainer]}>
                            <Text style={[styles.headerText, styles[type + 'HeaderText']]}>{title}</Text>
                        </View>                    
                        <ScrollView style={[styles.contentScrollableContainer]}>
                            <View style={[styles.contentContainer]}>
                                {
                                    typeof content === 'string' ?
                                    <Text style={[styles.contentText]}>{content}</Text> :
                                    content
                                }
                            </View>
                        </ScrollView>
                        <View style={styles.buttons}>
                            { 
                                buttons && buttons.map((button, index) => {
                                    let { style, title, onPress } = button;
                                    return (
                                        <TouchableOpacity
                                            style={[
                                                styles.button, 
                                                style, 
                                                index !== buttons.length - 1 && styles.borderOnRight
                                            ]}
                                            onPress={onPress}
                                            >
                                            <Text>{title}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    transparentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    container: {
        width: 300,
        borderRadius: 6,
        backgroundColor: 'white',
    },
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorHeaderText: {
        color: color.coblicRed
    },
    headerText: {
        textAlign: 'center',
        fontSize: font.size.modalHeader,
        fontWeight: font.weight.bold,
        color: color.coblicBlue
    },
    contentScrollableContainer: {
        marginBottom: 5,
        paddingTop: 5,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 5,
        marginBottom: 15,
        minHeight: 40,
        maxHeight: 350,
    },
    contentContainer: {

    },
    contentText: {
        textAlign: 'center',
        fontSize: font.size.modalContent,
    },
    buttons: {
        height: 48,
        flexDirection: 'row',
        alignItems:'stretch',
        width: '100%'
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: color.coblicGrey,
        borderTopWidth: 1,
    },
    buttonText: {
        fontSize: font.size.default,
        color: color.coblicBlue

    },
    borderOnRight: {
        borderRightColor: color.coblicGrey,
        borderRightWidth: 1,
    }
});
export default CommonModal;