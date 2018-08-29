import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import StubComponent from '../components/StubComponent';

@inject('stubStore')
@observer
export default class StubScreen extends Component {
  render() {
    return (
      <View>
        <StubComponent></StubComponent>
      </View>
    )
  }
}

const styles = StyleSheet.create({})
