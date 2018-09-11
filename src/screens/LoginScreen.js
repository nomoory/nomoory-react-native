import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Container, Content, Form, Item, Input, Label, Button } from 'native-base';
import { Linking } from 'react-native';

@inject('authStore', 'authStore')
@observer
export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container>
        <Content>
          Coblic
          <Form>
            <Item floatingLabel>
              <Label>이메일</Label>
              <Input onChangeText={this.onChangeEmail}/>
            </Item>
            <Item floatingLabel last>
              <Label>비밀번호</Label>
              <Input onChangeText={this.onChangePassword}/>
            </Item>
            <Button primary>
              <Text onPress={this.onPressLoginButton}> 로그인 </Text>
            </Button>
          </Form>
          <Text onPress={this.onPressResetPassword}>비밀번호 재설정</Text>
          <Text onPress={this.onPressSignin}>회원가입</Text>
        </Content>
      </Container>
    )
  }
  onChangeEmail = (text) => {
    this.props.authStore.setEmail(text);
    console.log(this.props.authStore.value.email);
  }
  onChangePassword = (text) => {
    this.props.authStore.setPassword(text);
  }
  onPressLoginButton = (e) => {
    // request login through authStore
    this.props.authStore.login();
  }
  onPressResetPassword = (e) => {
    // move to forgot password web
    Linking.openURL('https://google.com');
  }
  onPressSignin = (e) => {
    // move to signin web
    Linking.openURL('https://naver.com');
  }

}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});