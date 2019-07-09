import React, { Component } from 'react';
import { StyleSheet, View, Platform, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import headerStyle from '../styles/headerStyle';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Message from '../components/Chat/Message';
import { TouchableOpacity } from 'react-native-gesture-handler';
import commonStyle from '../styles/commonStyle';
import { computed } from 'mobx';

@inject('chatStore', 'userStore', )
@observer
export default class ChatScreen extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            title: '채팅',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
            ...headerStyle.white,
        };
    };

    onSend(messages = []) {
        this.props.chatStore.sendMessage(messages[0]);
    }

    renderMessage(props) {
        const { currentMessage: { text: currentText } } = props;

        let messageTextStyle;

        // Make "pure emoji" messages much bigger than plain text.
        if (
            currentText
            // && emojiUtils.isPureEmojiString(currentText)
        ) {
            messageTextStyle = {
                fontSize: 14,
                // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
                lineHeight: Platform.OS === 'android' ? 34 : 30,
            };
        }

        return (
            <Message 
                {...props} 
                messageTextStyle={messageTextStyle}
            />
        );
    }

    @computed
    get user() {
        const { currentUser } = this.props.userStore;
        if (currentUser) {
            const {
                nickname
            } = currentUser;

            return {
                _id: uuid,
                name: nickname,
                avatar: ''
            };
        }

        return null;
    }


    render() {
        const { isLoggedIn } = this.props.userStore;
        return (
            <View style={styles.container}>
                <GiftedChat
                    messages={this.props.chatStore.formedMessage}
                    onSend={messages => this.onSend(messages)}
                    user={this.user}
                    renderMessage={this.renderMessage}
                    renderInputToolbar={
                        isLoggedIn
                        ? null
                        : () => (
                            <TouchableOpacity 
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.props.navigation.navigate('Login');
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        marginLeft: 8,
                                        fontWeight: '500',
                                        color: commonStyle.color.brandGrey,
                                    }}
                                >로그인 후 이용 가능합니다.</Text>
                            </TouchableOpacity>
                        )
                    }
                />
                { Platform.OS === 'android' ? <KeyboardSpacer /> : null }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
