import React, { Component } from 'react';
import { 
    inject, 
    observer 
} from 'mobx-react';

@inject('stubStore')
@observer
class StubComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text onPress={this.props.stubStore.increaseTestValue}>Open {this.props.stubStore.testValue}</Text>
      </View>
    );
  }
}

export default StubComponent;