import React, { Component } from 'react';
import headerStyle from '../styles/headerStyle';
import { Linking, Text, StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import logoSrc from '../../assets/images/logos/logo_blue.png'

@withNavigation
@inject('userStore', 'authStore', 'modalStore')
@observer
export default class EtcScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '더보기',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
            ...headerStyle.blue
        };
    };

    _onPressLogin = () => {
        this.props.navigation.navigate('Login');
    }
    _onPressLogout = () => {
        this.props.modalStore.openModal({
            type: 'preset',
            title: '로그아웃',
            content: '로그아웃 하시겠습니까?',
            buttons: [
                {
                    title: '취소',
                    onPress: () => {this.props.modalStore.closeModal()}
                },{
                    title: '확인',
                    onPress: () => {
                        this.props.authStore.logout(); 
                        this.props.modalStore.closeModal();
                    }
                }, 
            ]
        });
    }
    _onPressAnnouncement = (e) => {
        // Linking.openURL(Expo.Constants.manifest.extra.ANNOUNCEMENT_LINK); 
    }
    _onPressZendesk = (e) => { 
        // Linking.openURL(Expo.Constants.manifest.extra.CUSTOMER_CENTER_LINK);
    }
    _onPressWhitePaper = (e) => {
        // Linking.openURL(Expo.Constants.manifest.extra.WHITEPAPER_LINK);
    }
    render() {
        const { profile, email } = this.props.userStore.currentUser || {};
        const { real_name_masked } = profile || {};
        return (
            <View style={[styles.container]}>
                <View style={styles.welcomeContainer}>
                    <Image
                        style={{ height: 50, resizeMode: 'contain' }}
                        source={logoSrc}
                    />
                </View>
                <ScrollView style={[styles.scrollContainer]}>
                    <TouchableOpacity style={[styles.scrollItem, styles.scrollItemFirst]}
                        onPress={this._onPressAnnouncement}
                        >
                        <Ionicons name="md-checkmark-circle" size={iconSize} color={iconColor} />
                        <Text style={[styles.scrollItemText]}>공지사항</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.scrollItem]}
                        onPress={this._onPressZendesk}
                        >
                        <Ionicons name="md-business" size={iconSize} color={iconColor}/>
                        <Text style={[styles.scrollItemText]}>고객센터</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.scrollItem]}
                        onPress={this._onPressWhitePaper}
                        >
                        <Ionicons name="md-paper" size={iconSize} color={iconColor}/>
                        <Text style={[styles.scrollItemText]}>백서</Text>
                    </TouchableOpacity>
                    {
                        this.props.userStore.isLoggedIn ? 
                        <TouchableOpacity style={[styles.scrollItem]}
                            onPress={this._onPressLogout}
                            >
                            <Ionicons name="md-log-out" size={iconSize} color={iconColor}/>
                            <Text style={[styles.scrollItemText]}>로그아웃</Text>
                        </TouchableOpacity> : 
                        <TouchableOpacity style={[styles.scrollItem]}
                            onPress={this._onPressLogin}
                            >
                            <Ionicons name="md-log-in" size={iconSize} color={iconColor}/>
                            <Text style={[styles.scrollItemText]}>로그인</Text>
                        </TouchableOpacity>
                    }
                </ScrollView>
            </View>
        )
    }
}

const iconSize = 28;
const iconColor = '#0042b7';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    welcomeContainer: {
        width: '100%',
        height: 292,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    scrollItemFirst: {
        borderTopWidth: 1,
        borderTopColor: '#e9eaea',
    },
    scrollItem: {
        paddingLeft: 15,
        flexDirection: 'row',
        width: '100%',
        height: 64,
        borderBottomWidth: 1,
        borderBottomColor: '#e9eaea',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    scrollItemText: {
        marginLeft: 12,
        fontSize: 14,
        color: iconColor,
        fontWeight: '600'
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
})
