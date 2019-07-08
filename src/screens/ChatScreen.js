import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { inject, observer } from 'mobx-react';
import headerStyle from '../styles/headerStyle';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Message from '../components/Chat/Message';

@inject('tradingPairStore')
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
    state = {
        messages: [],
    }

    componentWillMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello Coinbit!',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
            ],
        })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
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
            <Message {...props} messageTextStyle={messageTextStyle} />
        );
    }


    render() {
        return (
            <View style={styles.container}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 3,
                        name: '손준혁',
                        avatar: 'https://placeimg.com/140/140/any',
                    }}
                    renderMessage={this.renderMessage}
                />
                {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
