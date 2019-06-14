import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Linking } from 'react-native';
import { withNavigation } from 'react-navigation';
import commonStyles, { color } from '../styles/commonStyle';
import backIconSrc from '../../assets/images/login/back_icon.png';

let from = 'Exchagne';

@withNavigation
@inject('signupStore', 'modalStore', 'userStore')
@observer
export default class SignupScreen extends Component {
    static navigationOptions = { header: null };
    static navigationOptions = (({ navigation }) => {
        from = navigation.getParam('from', 'Exchange');
        return {
            header: null
        };
    });

    _onChangeEmail = (text) => {
        this.props.signupStore.setEmail(text);
    }

    _onChangePassword = (text) => { 
        this.props.signupStore.setPassword(text); 
    }

    _onChangePasswordConfirmation = (text) => { 
        this.props.signupStore.setPasswordConfirmation(text);
        console.log(this.props.signupStore.values) 
    }
    
    _toggleCheckBoxByName = (name) => () => {
        this.props.signupStore.toggleCheckboxStatus(name);
    }

    _onPressSignupButton = (e) => {
        this.props.signupStore.signup()
            .then((user) => {
                this.props.modalStore.openModal({
                    type: 'preset',
                    title: '가입 완료',
                    content: '가입한 이메일로 인증메일이 전송되었습니다. 메일함을 확인해주세요.',
                    onClose: () => {
                        this.props.navigation.navigate(from);
                    }
                });
            }).catch((err) => {});
    }
    _onPressResetPassword = (e) => {
        Linking.openURL(Expo.Constants.manifest.extra.RESETPASSWORD_LINK);
    }

    _onPressLogin = (e) => { 
        this.props.navigation.navigate('Login');
    }

    _onPressCloseLoginScreen = (e) => {
        this.props.navigation.navigate('Exchange');
    }

    render() {
        let { values } = this.props.signupStore || {};
        let { 
            email, 
            password, 
            passwordConfirmation,

            agreesToContracts,
            agreesToInstruction,
            agreesToMarketing,
        } = values || {};
        
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
                    <TextInput
                        style={[styles.passwordInput, styles.input]}
                        secureTextEntry={true}
                        onChangeText={this._onChangePasswordConfirmation} 
                        placeholder={`비밀번호확인`}
                        value={passwordConfirmation}
                        autoCapitalize="none"
                    />

                    <TouchableOpacity style={[ styles['checkboxContainer'] ]}
                        onPress={this._toggleCheckBoxByName('agreesToContracts')}
                        >
                        <View style={[
                            styles.checkBox,
                            agreesToContracts && styles.checked
                        ]}>
                            <Image
                                style={{ height: 6, resizeMode: 'contain' }}
                                source={require('../../assets/images/depositWithdraw/ic_check_small.png')}
                            />
                        </View>
                        <Text style={[styles.checkboxText]}>[필수] 이용약관 및 개인정보취급방침에 동의합니다.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[ styles['checkboxContainer'] ]}
                        onPress={this._toggleCheckBoxByName('agreesToInstruction')}
                        >
                        <View style={[
                            styles.checkBox,
                            agreesToInstruction && styles.checked
                        ]}>
                            <Image
                                style={{ height: 6, resizeMode: 'contain' }}
                                source={require('../../assets/images/depositWithdraw/ic_check_small.png')}
                            />
                        </View>
                        <Text style={[styles.checkboxText]}>[필수] 암호화폐 거래 위험고지와 입출금 관련 안내에 동의합니다.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[ styles['checkboxContainer'] ]}
                        onPress={this._toggleCheckBoxByName('agreesToMarketing')}
                        >
                        <View style={[
                            styles.checkBox,
                            agreesToMarketing && styles.checked
                        ]}>
                            <Image
                                style={{ height: 6, resizeMode: 'contain' }}
                                source={require('../../assets/images/depositWithdraw/ic_check_small.png')}
                            />
                        </View>
                        <Text style={[styles.checkboxText]}>[선택] 마케팅 정보 활용에 동의합니다.</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.loginButton]}
                        onPress={this._onPressSignupButton}>
                        {
                            this.props.signupStore.isLoading ?
                            <ActivityIndicator size="small" color={commonStyles.color.coblicPaleBlue}/> :
                            <Text style={[styles.loginButtonText]}>회원가입</Text>
                        }
                    </TouchableOpacity>
                    <Text style={[styles.forgotPasswordText]}
                        onPress={this._onPressResetPassword}>비밀번호를 잊어버리셨나요?</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.signupButton]}
                    onPress={this._onPressLogin}>
                    <Text style={[styles.signupButtonText]}>로그인</Text>
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
const borderRadius = 6;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.coblicBlue,
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
        marginTop: 30, 
        backgroundColor: '#ffc107',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius
    },
    loginButtonText: {
        color: color.coblicBlue,
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

    checkboxContainer: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 13,
        height: 13,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: color.coblicPaleGrey,
        backgroundColor: color.white,
        marginRight: 4,
        marginLeft: 10,
    },
    checkboxText: {
        color: 'white',
        fontSize: 13,
    },
    checked: {
        backgroundColor: '#ffc107',
        borderColor: '#ffc107',
    },
});