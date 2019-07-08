import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, Image, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Linking } from 'react-native';
import { action, observable } from 'mobx';
import { withNavigation } from 'react-navigation';
import commonStyle, { color } from '../styles/commonStyle';
import backIconSrc from '../../assets/images/login/back_icon.png';

@withNavigation
@inject('authStore', 'modalStore')
@observer
export default class OtpVerificationScreen extends Component {
    static navigationOptions = { header: null };

    @observable validOtp = null;

    _onChangeOtpCode = (code) => { 
        this.validOtp = true;
        if ( 6 <= code.length ) {
            this.props.authStore.setOtpCode(code ? code.split('').splice(0, 6).join('') : ''); 
            this.props.authStore.verifyOTPLogin()
            .then((res) => {
                this.props.modalStore.openModal({
                    title: '인증 완료',
                    content: '정상적으로 인증되었습니다.',
                    buttons: [{
                        title: '확인',
                        onPress: () => {
                            this.props.navigation.navigate('Exchange');
                            this.props.modalStore.closeModal()
                        }
                    }]
                });
            })
            .catch(action((err) => {
                this.validOtp = false;
                if (err.response.data.error_code === 2102) { // Provided temporary_otp_token expired
                    this.props.modalStore.openModal({
                        title: '입력 시간 초과',
                        content: '코드 입력 시간이 초과하였습니다.\n다시 로그인해주세요',
                        buttons: [{
                            title: '확인',
                            onPress: () => {
                                this.props.navigation.navigate('Login');
                                this.props.modalStore.closeModal()
                            }
                        }]
                    });
                }
            }));
        } else {
            this.props.authStore.setOtpCode(code);
        }
    }

    onPressZendesk = () => { 
        // Linking.openURL(Expo.Constants.manifest.extra.CUSTOMER_CENTER_LINK); 
    }
    _onPressCloseOtpScreen = (e) => { this.props.navigation.navigate('Exchange'); }

    render() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.contentContainer]}>
                    <Text style={[styles.otpCodeInputTitle]}>OTP 코드 입력</Text>

                    <TextInput
                        style={[styles.passwordInput, styles.input]}
                        onChangeText={this._onChangeOtpCode} 
                        placeholder={`6자리를 입력해주세요`}
                        value={this.props.authStore.otpVerificationValues.otp_code}
                    />
                    {this.validOtp === false && <Text style={[styles.warningText]}>* 유효하지 않은 OTP 코드입니다.</Text>}
                    <Text style={[styles.noticeText, styles.firstNoticeText]}>* OTP 앱에 생성된 6자리 코드를 입력하십시오.</Text>
                    <Text style={[styles.noticeText]}>{`* OTP 인증이 불가하거나 복구코드를 분실했을 경우, `}
                        <Text style={[styles.noticeImportantText]} onPress={this.onPressZendesk}>{'고객센터'}</Text>로 문의해주세요.
                    </Text>
                </View>
 
                <TouchableOpacity style={styles.closeButton}
                    onPress={this._onPressCloseOtpScreen}
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
        backgroundColor: color.brandBlue,
        height: '100%',
    
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        width
    },
    warningText: {
        marginTop: 3,
        color: commonStyle.color.coblicYellow,
        fontWeight: '500',
    },
    firstNoticeText: {
        marginTop: 8,
    },
    noticeText: {
        marginTop: 3,
        fontWeight: '500',
        color: commonStyle.color.coblicPaleGrey
    },
    noticeImportantText: {
        fontWeight: '600',
        color: 'white',
        textDecorationLine: 'underline'
    },
    otpCodeInputTitle: {
        color: 'white',
        fontWeight: '700',
        fontSize: 24,
        alignSelf: 'flex-start'
    },
    otpCodeInput: {

    },
    otpWarningContainer: {
        width: '100%'
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

    closeButton: {
        position: 'absolute',
        top: 6,
        left: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
});