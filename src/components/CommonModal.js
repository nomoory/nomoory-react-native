import React, { Component } from 'react';
import { 
  StyleSheet, 
  Button, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';
import Modal from "react-native-modal";
import { 
    inject, 
    observer 
} from 'mobx-react';

@inject('modalStore')
@observer
class CommonModal extends Component {
  constructor(props) {
    super(props);
  }

  _closeModal = () => this.props.modalStore.closeModal();

  render() {
    let { isModalVisible, title, content, cancelButtonName } = this.props.modalStore;
    return (
      <Modal isVisible={ isModalVisible }
        onBackdropPress={ this._closeModal }
      >
        <View style={ styles.container }>
          <Text>{ title }</Text>
          <Text>{ content }</Text>
          <TouchableOpacity >
            <Button onPress={ this._closeModal }
            title={ cancelButtonName }></ Button>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },

    
})
export default CommonModal;