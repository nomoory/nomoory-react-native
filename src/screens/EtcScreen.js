import React, { Component } from 'react';
import headerStyle from '../styles/headerStyle';
import { Linking, Text, StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import AnnouncementBox from '../components/AnnouncementBox';
import commonStyle from '../styles/commonStyle';
import * as Icon from '@expo/vector-icons';

@withNavigation
@inject('userStore', 'authStore', 'modalStore', 'announcementStore')
@observer
export default class EtcScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '내정보',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
            ...headerStyle.white,
        };
    };

    componentDidMount() {
        this.props.announcementStore.loadAnnouncementList();
    }

    _showMoreImage(width = 10) {
        return <Image
            style={{ width, resizeMode: 'contain' }}
            source={
                require('../../assets/images/depositWithdraw/btn_arrow_small.png')
            }
        />;
    }

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
    _onPressZendesk = (e) => { 
        // Linking.openURL(Expo.Constants.manifest.extra.CUSTOMER_CENTER_LINK);
    }
    _onPressWhitePaper = (e) => {
        // Linking.openURL(Expo.Constants.manifest.extra.WHITEPAPER_LINK);
    }
    _onPressAnnouncement = (e) => {
        this.props.navigation.navigate('AnnouncementList');
    }
    _onPressSecurityLevel = (e) => {
        // this.props.navigation.navigate('AnnouncementList');
    }
    render() {
        const { verificationProgress, currentUser } = this.props.userStore
        const { profile, email } = currentUser || {};
        const { real_name_masked, real_name } = profile || {};
        return (
            <ScrollView style={[styles.scrollContainer]}>
                { 
                    this.props.userStore.isLoggedIn
                    ? (
                        <View 
                            style={[
                                styles.userInfo,
                            ]}
                        >
                            <View style={[styles.emailContainer]}>
                                <Text style={styles.emailText}>{email} 님, 환영합니다!</Text>
                            </View>           
                            <View style={[styles.divider]} />
                            <TouchableOpacity
                                style={[styles.securityLevel]}
                                onPress={this._onPressSecurityLevel}
                            >
                                <Icon.MaterialCommunityIcons
                                    name="security"
                                    size={40} 
                                    color={commonStyle.color.brandBlue}
                                    // style={styles.favoriteIcon}
                                />
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Text
                                        style={styles.securityLevelText}
                                    >보안등급 {this.props.userStore.verificationProgress || '-'}/5 단계
                                    </Text>
                                    {/* <Icon.AntDesign
                                        name="right"
                                        size={14} 
                                        // style={styles.favoriteIcon}
                                    /> */}
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
                <View style={styles.listContainer}>    
                    <AnnouncementBox />
                </View>
                <View style={styles.listContainer}>                    
                    <TouchableOpacity style={[styles.row]}
                        onPress={this._onPressZendesk}
                        >
                        <Text style={[styles.rowText]}>고객센터</Text>
                        { this._showMoreImage() }
                    </TouchableOpacity>             
                </View>
                <View style={styles.listContainer}>
                    {
                        this.props.userStore.isLoggedIn ? 
                        <TouchableOpacity style={[styles.row]}
                            onPress={this._onPressLogout}
                            >
                            <Text style={[styles.logoutText]}>로그아웃</Text>
                        </TouchableOpacity> : 
                        <TouchableOpacity style={[styles.row]}
                            onPress={this._onPressLogin}
                            >
                            <Text style={[styles.loginText]}>로그인</Text>
                        </TouchableOpacity>
                    }
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    securityLevel: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 15,
    },
    divider: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    securityLevelText: {
        textDecorationLine: 'underline',
    },
    listContainer: {
        backgroundColor: 'white',
        marginBottom: 15,
    },
    emailContainer: {
        paddingBottom: 15,
    },
    emailText: {
        fontWeight: '600',
    },
    userInfo: {
        backgroundColor: '#f7f8fa',
        padding: 15,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: '#f7f8fa',
        height: 44,
        paddingLeft: 10,
        paddingRight: 10,
    },
    rowText: {
        fontWeight: '600',
        fontSize: 14,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f7f8fa'
    },
    loginText: {
        fontWeight: '500',
        color: commonStyle.color.brandBlue,
    },
    logoutText: {
        fontWeight: '500',
        color: commonStyle.color.brandBlue,
    },

})
