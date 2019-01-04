import React, { Component } from 'react';
import { Linking, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('userStore', 'authStore')
@observer
export default class EtcScreen extends Component {
    _onPressLogin = () => {
        this.props.navigation.navigate('Login');
    }
    _onPressLogout = () => {
        this.props.authStore.logout();
    }
    _onPressAnnouncement = (e) => { Linking.openURL('https://coblic.com/announcements'); }
    _onPressZendesk = (e) => { Linking.openURL('https://coblic.zendesk.com/hc/ko'); }
    _onPressWhitePaper = (e) => { Linking.openURL('https://bit.ly/Coblic_WhitePaper'); }
    render() {
        const {
            profile,
            email
        } = this.props.userStore.currentUser || {};
        const {
            real_name_masked
        } = profile || {};
        console.log(this.props.userStore.currentUser);
        return (
            <View style={[styles.container]}>
                <Text>{real_name_masked ? real_name_masked + '님 ' : ''}환영합니다!</Text>
                { email && <Text>{email}</Text>}
                <TouchableOpacity style={[styles.button]}
                    onPress={this._onPressAnnouncement}
                    >
                    <Text>공지사항</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button]}
                    onPress={this._onPressZendesk}
                    >
                    <Text>고객센터</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button]}
                    onPress={this._onPressWhitePaper}
                    >
                    <Text>코블릭백서</Text>
                </TouchableOpacity>

                {
                    this.props.userStore.isLoggedIn ? 
                    <TouchableOpacity style={[styles.button]}
                        onPress={this._onPressLogout}
                        >
                        <Text>로그아웃</Text>
                    </TouchableOpacity> : 
                    <TouchableOpacity style={[styles.button]}
                        onPress={this._onPressLogin}
                        >
                        <Text>로그인</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
