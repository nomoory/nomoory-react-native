import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import headerStyle from '../styles/headerStyle';
import momentHelper from '../utils/momentHelper';
import commonStyle from '../styles/commonStyle';
import * as Icon from '@expo/vector-icons';

@withNavigation
@inject('tradingPairStore', 'announcementStore')
@observer
export default class AnnouncementListScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.goBackButton}
                        onPress={() => {
                            navigation.navigate('Etc');
                        }}
                    >
                        <Icon.AntDesign
                            name="left"
                            size={30} color={commonStyle.color.headerTextColor}
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

    _onPressAnnouncement = (uuid) => () => {
        this.props.navigation.navigate('AnnouncementDetail', {
            uuid,
            from: 'AnnouncementList',
        });
    }

    componentDidMount() {
        this.props.announcementStore.loadAnnouncementList();
    }

    _loadMore = () => {
        this.props.announcementStore.loadNextAnnouncementList();
    }

    render() {
        const announcements = this.props.announcementStore.announcements || [];

        return (
            <View style={styles.container}>
                <FlatList 
                    data={announcements.length ? announcements : []}
                    // refreshing={this.state.refreshing}
                    // onRefresh={this.onRefresh}
                    enableEmptySections={true}
                    onEndReachedThreshold={1}
                    onEndReached={this._loadMore}
                    renderItem={({ item, index }) => {
                        const {
                            uuid,
                            korean_title,
                            english_title,
                            created,
                            modified,
                        } = item || {};
                                
                        const title = korean_title;

                        return (
                            <TouchableOpacity
                                style={[
                                    styles.announcementRow, 
                                    index === 0 && styles.firstAnnouncementRow,
                                ]}
                                onPress={this._onPressAnnouncement(uuid)}
                            >
                                <Text style={styles.titleText}>
                                    {title}
                                </Text>
                                <View style={styles.dateColumn}>
                                    {/* <Text  style={styles.created}>{momentHelper.getLocaleDatetime(created)}</Text> */}
                                    <Text
                                        style={styles.dateText}
                                    >{momentHelper.getLocaleDatetime(modified)}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    // emptyView={this._renderEmptyView}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyle.color.emptyBackgroundColor,
    },
    announcementRow: {
        backgroundColor: commonStyle.color.white,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: commonStyle.color.borderColor,
        height: 70,
        paddingLeft: 10,
    },
    firstAnnouncementRow: {
        borderTopWidth: 1,
        borderTopColor: commonStyle.color.borderColor,
    },
    titleText: {
        fontWeight: '500',
        marginBottom: 4,
        fontSize: 16,
    },
    dateText: {
        color: 'grey',
        fontSize: 13,
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
        color: commonStyle.color.headerTextColor
    },
    goBackButton: {
        display: 'flex',
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
