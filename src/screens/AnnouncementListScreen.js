import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import headerStyle from '../styles/headerStyle';
import momentHelper from '../utils/momentHelper';

@withNavigation
@inject('tradingPairStore', 'announcementStore')
@observer
export default class AnnouncementListScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '공지사항',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
            ...headerStyle.blue,
        };
    };

    _onPressAnnouncement = (uuid) => () => {
        this.props.navigation.navigate('AnnouncementDetail', {
            uuid,
        });
    }

    componentDidMount() {
        this.props.announcementStore.loadAnnouncementList();
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.announcementStore.announcements.map((announcement) => {
                        const {
                            uuid,
                            korean_title, english_title,
                        } = announcement;
                        let isKorean = true;
                        const title = isKorean ? korean_title : english_title;
                        return (
                            <TouchableOpacity
                                key={announcement.uuid}
                                style={styles.row}
                                onPress={this._onPressAnnouncement(uuid)}
                            >
                                <View style={styles.column}>
                                    <Text  style={styles.title}>{title}</Text>
                                </View>
                                <View style={styles.column}>
                                    {/* <Text  style={styles.created}>{momentHelper.getLocaleDatetime(announcement.created)}</Text> */}
                                    <Text  style={styles.column}>{momentHelper.getLocaleDatetime(announcement.modified)}</Text>
                                </View>
                            </TouchableOpacity>
                        );

                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
