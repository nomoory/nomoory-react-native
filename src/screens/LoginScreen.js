import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Container, Button } from 'native-base';
import { Linking } from 'react-native';
import { withNavigation } from 'react-navigation';
import { color } from '../styles';

let from = 'Exchagne';
@withNavigation
@inject('authStore', 'modalStore')
@observer
export default class LoginScreen extends Component {
    static navigationOptions = { header: null };
    static navigationOptions = (({ navigation }) => {
        from = navigation.getParam('from', 'Exchange');
        return {
            header: null
        };
    });

    onChangeEmail = (text) => { this.props.authStore.setEmailForLogin(text); }
    onChangePassword = (text) => { this.props.authStore.setPasswordForLogin(text); }
    onPressLoginButton = (e) => {
        this.props.authStore.login()
        .then((user) => {
            if (user.need_otp_verify || user.need_otp_verify === 'true') {
                this.props.navigation.navigate('OtpVerification')
            } else {
                console.log('from', from);
                this.props.navigation.navigate(from);
            }
        }).catch((err) => {
            // fail to login
        });
    }
    onPressResetPassword = (e) => { Linking.openURL('https://coblic.com/reset-password'); }
    onPressSignup = (e) => { Linking.openURL('https://coblic.com/signup'); }
    closeLoginScreen = (e) => { this.props.navigation.navigate('Main'); }

    render() {
        let { loginValues } = this.props.authStore || {};
        let { email, password } = loginValues || {};
        
        return (
            <Container style={[styles.container]}>
                <View style={[styles.logoContainer]}>
                    <Image
                        style={{width: 200, height: 52}}
                        source={require('../../assets/images/login/ic_navi_logo.png')}
                    />
                </View>
                <View style={[styles.email]}>
                    <Text style={[styles.emailInputLabel]}>이메일</Text>
                    <TextInput 
                        style={[styles.emailInput]}
                        onChangeText={this.onChangeEmail} 
                        value={email}
                    />
                </View>
                <View style={[styles.password]}>
                    <Text style={[styles.passwordInputLabel]}>비밀번호</Text>
                    <TextInput style={[styles.passwordInput]}
                        secureTextEntry={true}
                        onChangeText={this.onChangePassword} 
                        value={password}
                    />
                </View>
                <Button onPress={this.onPressLoginButton}>
                    <Text> 로그인 </Text>
                </Button>
                <View >
                    <Text onPress={this.onPressResetPassword}>비밀번호 재설정</Text>
                    <Text onPress={this.onPressSignup}>회원가입</Text>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.coblicBlue,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {

    },
    loginButton: {
        width: '100%'
    }
});