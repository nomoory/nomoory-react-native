import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Linking } from 'react-native';
import { withNavigation } from 'react-navigation';
import commonStyles, { color } from '../styles/commonStyle';
import backIconSrc from '../../assets/images/login/back_icon.png';

let from = 'Exchagne';

@withNavigation
@inject('authStore', 'modalStore', 'userStore')
@observer
export default class LoginScreen extends Component {
    static navigationOptions = { header: null };
    static navigationOptions = (({ navigation }) => {
        from = navigation.getParam('from', 'Exchange');
        return {
            header: null
        };
    });
    _onChangeEmail = (text) => { this.props.authStore.setEmailForLogin(text); }
    _onChangePassword = (text) => { this.props.authStore.setPasswordForLogin(text); }
    _onPressLoginButton = (e) => {
        this.props.authStore.login()
            .then((user) => {
                if (user.need_otp_verify || user.need_otp_verify === 'true') {
                    this.props.navigation.navigate('OtpVerification')
                } else {
                    this.props.navigation.navigate(from);
                }
            }).catch((err) => {});
    }
    _onPressResetPassword = (e) => { Linking.openURL(Expo.Constants.manifest.extra.RESETPASSWORD_LINK); }
    _onPressSignup = (e) => { 
        this.props.navigation.navigate('Signup');
        // Linking.openURL(Expo.Constants.manifest.extra.SIGNUP_LINK); 
    }
    _onPressCloseLoginScreen = (e) => { this.props.navigation.navigate('Exchange'); }

    render() {
        let { loginValues } = this.props.authStore || {};
        let { email, password } = loginValues || {};
        
        if (this.props.userStore.isLoggedIn) {
            this.props.navigation.navigate('Exchange');
        }

        return (
            <View style={[styles.container]}>
                <View style={[styles.logoContainer]}>
                    <Image
                        style={[
                            {
                                resizeMode: 'cover'
                            }]
                        }
                        source={require('../../assets/images/login/ic_navi_logo.png')}
                    />
                </View>
                <View style={[styles.inputContainer]}>
                    <TextInput 
                        style={[styles.emailInput, styles.input]}
                        onChangeText={this._onChangeEmail}
                        placeholder={`이메일`}
                        value={email}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={[styles.passwordInput, styles.input]}
                        secureTextEntry={true}
                        onChangeText={this._onChangePassword} 
                        placeholder={`비밀번호`}
                        value={password}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity 
                        style={[styles.loginButton]}
                        onPress={this._onPressLoginButton}>
                        {
                            this.props.authStore.isLoading ?
                            <ActivityIndicator size="small" color={commonStyles.color.coblicPaleBlue}/> :
                            <Text style={[styles.loginButtonText]}>로그인</Text>
                        }
                    </TouchableOpacity>
                    <Text style={[styles.forgotPasswordText]}
                        onPress={this._onPressResetPassword}>비밀번호를 잊어버리셨나요?</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.signupButton]}
                    onPress={this._onPressSignup}>
                    <Text style={[styles.signupButtonText]}>회원가입</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton}
                    onPress={this._onPressCloseLoginScreen}
                >
                    <Image
                        style={{ width: 42, resizeMode: 'contain' }}
                        source={backIconSrc}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const width = 270;
const height = 45;
const marginTop = 16;
const borderRadius = 0;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.brandBlue,
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: { 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 360,
        height: 100,
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 30,
    },
    input: {
        width,
        height,
        backgroundColor: 'white',
        padding: 10,
        paddingLeft: 18,
        marginTop,
        fontSize: 16,
        color: '#333333',
        borderRadius

    },
    loginButton: {
        width,
        height,
        marginTop: 26, 
        backgroundColor: '#F7B03E', // #ffc107',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius
    },
    loginButtonText: {
        color: 'white',//color.brandBlue,
        fontSize: 19,
        fontWeight: '700'
    },
    forgotPasswordText: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '500',
        color: 'white',
        textDecorationLine: 'underline',
    },
    signupButton: {
        marginBottom: 40,
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    signupButtonText: {
        color: 'white'        
    },
    closeButton: {
        position: 'absolute',
        top: 6,
        left: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
});