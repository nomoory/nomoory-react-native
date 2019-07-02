import React, { Component } from 'react';
import headerStyle from '../styles/headerStyle';
import { Linking, Text, StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import AnnouncementBox from '../components/AnnouncementBox';
import commonStyle from '../styles/commonStyle';

@withNavigation
@inject('userStore', 'authStore', 'modalStore', 'announcementStore')
@observer
export default class EtcScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '더보기',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
            ...headerStyle.blue,
        };
    };

    componentDidMount() {
        this.props.announcementStore.loadAnnouncementList();
    }

    _showMoreImage() {
        return <Image
            style={{ width: 10, resizeMode: 'contain' }}
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
                        <View style={[
                            styles.userInfo, styles.listContainer
                        ]}>
                            <TouchableOpacity
                                style={[styles.row]}>
                                <Text style={styles.emailText}>{email} 님, 환영합니다!</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.row, styles.securityLevel]}
                                onPress={this._onPressSecurityLevel}
                            >
                                <Text 
                                    style={styles.securityLevelText}>
                                보안등급 {this.props.userStore.verificationProgress || '-'}/5 단계
                                </Text>
                                { this._showMoreImage() }
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
                    <TouchableOpacity
                        style={[styles.row]}
                        onPress={this._onPressWhitePaper}
                        >
                        <Text style={[styles.rowText]}>백서</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    securityLevelText: {
        marginRight: 10,
    },
    listContainer: {
        backgroundColor: 'white',
        marginBottom: 15,
    },
    emailText: {
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: '#f7f8fa',
        height: 36,
        paddingLeft: 10,
        paddingRight: 10,
    },
    rowText: {
        fontWeight: '600',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f7f8fa'
    },
    loginText: {
        color: commonStyle.color.coblicYellow,
    },
    logoutText: {
        color: commonStyle.color.brandBlue,
    },

})
