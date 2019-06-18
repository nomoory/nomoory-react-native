import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import { inject, observer } from 'mobx-react';
import headerStyle from '../styles/headerStyle';
import momentHelper from '../utils/momentHelper';

let uuid = null;

@inject('tradingPairStore', 'announcementStore', 'modalStore')
@observer
export default class AnnouncementDetailScreen extends Component {
    state = {
        announcement: {}
    };
    
    static navigationOptions = ({ navigation }) => {
        uuid = navigation.getParam('uuid', '');
        return {
            title: '공지사항',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
            ...headerStyle.blue,
        };
    };

    async componentDidMount() {
        this.setState({
            announcement: this.props.announcementStore.getAnnouncementById(uuid)
        });

        if (Obejct.keys(this.state.announcement).length === 0) {
            this.props.modalStore.openModal({
                type: 'preset',
                title: '조회 불가',
                content: '해당 공지사항을 불러올 수 없습니다.',
            });
        } else {
            await this.state.announcement.loadAnnouncement();
        }
    }

    render() {
        const {
            korean_title, english_title, korean_content, english_content, created,
        } = this.state.announcement || {};
        let title = korean_title;
        let content = korean_content;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                        <Text style={styles.titleText}>
                            {title}
                        </Text>
                    <View style={styles.date}>
                        <Text style={styles.dateTitleText}>
                            발행일
                        </Text>
                        <Text style={styles.dateContentText}>
                            {momentHelper.getLocaleDatetime(created)}
                        </Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={styles.contentText}>
                        {content}
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
