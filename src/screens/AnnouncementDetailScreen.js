import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import { inject, observer } from 'mobx-react';
import headerStyle from '../styles/headerStyle';
import momentHelper from '../utils/momentHelper';

@inject('tradingPairStore', 'announcementStore', 'modalStore')
@observer
export default class AnnouncementDetailScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        this.uuid = navigation.getParam('uuid', '');

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
        this.announcement = this.props.announcementStore.getAnnouncementById(this.uuid);
        if (!this.announcement) {
            this.props.modalStore.openModal({
                type: 'preset',
                title: '공지사항 조회 불가',
                content: '해당 공지사항을 불러올 수 없습니다.',
            });
        } else {
            await this.announcement.loadAnnouncement();
        }
    }

    render() {
        const {
            korean_title, english_title, korean_content, english_content, created,
        } = announcement || {};
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.title}>
                        <View style={styles.titleText}>
                            {title}
                        </View>
                    </View>
                    <View className="date-container">
                        <Text style={styles.text}>
                            발행일
                        </Text>
                        <Text style={styles.text}>
                            {momentHelper(created).format('L')}
                        </Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.contentText}>
                        {content}
                    </View>
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
