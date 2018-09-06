import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Container, Content, Form, Item, Input, Label } from 'native-base';

@inject('authStore')
@observer
export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText={this.onChangeEmail}/>
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input onChangeText={this.onChangePassword}/>
            </Item>
          </Form>
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

}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});