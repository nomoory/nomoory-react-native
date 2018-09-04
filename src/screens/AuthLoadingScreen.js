import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { inject, observer } from 'mobx-react';

@inject('stubStore', 'api')
@observer
export default class AuthLoadingScreen extends Component {

  constructor(props) {
    super(props);
    this.moveToMainStack = this.moveToMainStack.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> Loading Screen 입니다. Button을 클릭하면 넘어갑니다. </Text>
        <Button onPress={this.moveToMainStack} title={"Main page로 넘어가기."}>
        </Button>
      </View>
    )
  }

  moveToMainStack(e) {
    this.props.navigation.navigate('Main');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },    
})
