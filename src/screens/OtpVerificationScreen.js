import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Linking } from 'react-native';
import { color } from '../styles/commonStyle';
import { action, observable } from 'mobx';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('authStore')
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
                this.props.navigation.navigate('Exchange');
            })
            .catch(action((err) => {
                this.validOtp = false;
            }));
        } else {
            this.props.authStore.setOtpCode(code);
        }
    }

    onPressZendesk = () => { Linking.openURL('https://coblic.zendesk.com/hc/ko'); }

    render() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.otpCodeInputContainer]}>
                    <Text style={[styles.otpCodeInputTitle]}>OTP 코드</Text>
                    <TextInput style={[styles.otpCodeInput]}
                        onChangeText={this._onChangeOtpCode} 
                        value={this.props.authStore.otpVerificationValues.otp_code}
                    />
                    {this.validOtp === false && <Text>* 유효하지 않은 OTP 코드입니다.</Text>}
                </View>
                <View style={[styles.otpWarningContainer]}>
                    <Text >OTP 앱에 생성된 6자리 코드를 입력하십시오.</Text>
                    <Text >* OTP 인증이 불가하거나 복구코드 분실시
                        <Text onPress={this.onPressZendesk}>{' 고객센터'}</Text>로 문의해주세요.
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.coblicBlue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    otpCodeInputContainer: {
        width: '100%'
    },
    otpCodeInputTitle: {

    },
    otpCodeInput: {

    },
    otpWarningContainer: {
        width: '100%'
    }
});