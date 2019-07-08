import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView} from 'react-native';
import { inject, observer } from 'mobx-react';
import headerStyle from '../styles/headerStyle';
import momentHelper from '../utils/momentHelper';
import commonStyle from '../styles/commonStyle';
import * as Icon from '@expo/vector-icons';

let uuid = null;
let from = null;

@inject('tradingPairStore', 'announcementStore', 'modalStore')
@observer
export default class AnnouncementDetailScreen extends Component {
    state = {
        announcement: {}
    };
    
    static navigationOptions = ({ navigation }) => {
        from = navigation.getParam('from', 'Etc');
        uuid = navigation.getParam('uuid', '');
        return {
            headerLeft: (
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(from);
                        }}
                    >
                        <Icon.AntDesign
                            name="left"
                            size={30} color={commonStyle.color.headerTextColor}
                        // style={styles.favoriteIcon}
                        />
                    </TouchableOpacity>
                    <Text
                        style={styles.headerText}
                        maxFontSizeMultiplier={20}
                        allowFontScaling={false}
                    >공지사항
                    </Text>
                </View>
            ),
            ...headerStyle.white,
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
                        <Text style={styles.dateText}>
                            {momentHelper.getLocaleDatetime(created)}
                        </Text>
                    </View>
                </View>
                <ScrollView style={styles.body}>
                    <Text style={styles.contentText}>
                        {content}
                    </Text>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },

    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeft: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        marginLeft: 5,
        color: commonStyle.color.headerTextColor
    },

    header: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: commonStyle.color.borderColor,
        height: 70,
        paddingLeft: 10,
    },
    titleText: {
        marginBottom: 4,
        fontSize: 16,
        fontWeight: '500',
    },
    date: {
        display: 'flex',
        flexDirection: 'row',
    },
    dateText: {
        color: 'grey',
        fontSize: 13,
    },
    body: {
        flex: 1,
    },
    contentText: {
        margin: 20,
        marginLeft: 10,
        marginRight: 10,
        lineHeight: 20,
    }
});
