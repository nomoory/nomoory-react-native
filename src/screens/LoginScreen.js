import React, { Component } from 'react';
import * as Icon from '@expo/vector-icons'
import { Text, StyleSheet, View, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Linking } from 'react-native';
import { withNavigation } from 'react-navigation';
import commonStyles, { color } from '../styles/commonStyle';
import backIconSrc from '../../assets/images/login/back_icon.png';
import { Input } from 'react-native-elements';

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
            }).catch((err) => { });
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
                    <Input
                        containerStyle={styles.input}
                        leftIconContainerStyle={{
                            marginLeft: 4,
                            marginRight: 8,
                        }}
                        inputStyle={{ color: 'white'}}
                        placeholder='EMAIL'
                        value={email}
                        leftIcon={
                            <Icon.MaterialCommunityIcons
                                name="email-outline"
                                size={24}
                                color="white"
                            />
                        }
                        onChangeText={this._onChangeEmail}
                    />
                    <Input
                        containerStyle={styles.input}
                        leftIconContainerStyle={{
                            marginLeft: 4,
                            marginRight: 8,
                        }}
                        inputStyle={{ color: 'white'}}
                        secureTextEntry={true}
                        placeholder='PASSWORD'
                        value={password}
                        leftIcon={
                            <Icon.MaterialCommunityIcons
                                name="key"
                                size={24}
                                color="white"
                            />
                        }
                        onChangeText={this._onChangePassword}
                    />
                    {/* <TextInput
                        style={[styles.passwordInput, styles.input]}
                        secureTextEntry={true}
                        onChangeText={this._onChangePassword}
                        placeholder={`비밀번호`}
                        value={password}
                        autoCapitalize="none"
                    /> */}
                    <TouchableOpacity
                        style={[styles.loginButton]}
                        onPress={this._onPressLoginButton}>
                        {
                            this.props.authStore.isLoading ?
                                <ActivityIndicator size="small" color={commonStyles.color.brandPaleBlue} /> :
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

const width = 300;
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
        justifyContent: 'space-between',
        paddingTop: 100,
        paddingBottom: 100,
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 360,
        height: 100,
        marginTop: 20,
        marginBottom: 20,
    },
    inputContainer: {
        width,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 30,
    },
    input: {
        marginBottom: 20,
    },
    loginButton: {
        width,
        height,
        marginTop: 15,
        backgroundColor: 'white', // #ffc107',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius
    },
    loginButtonText: {
        color: color.brandBlue,
        fontSize: 16,
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
        top: 10,
        left: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
});