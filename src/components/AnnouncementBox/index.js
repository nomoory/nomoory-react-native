import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import momentHelper from '../../utils/momentHelper';

@withNavigation
@inject('announcementStore')
@observer
export default class AnnouncementBox extends Component {
    _onPressAnnouncementById = (uuid) => () => {
        this.props.navigation.navigate('AnnouncementDetail', {
            uuid,
        });
    }

    _onPressAnnouncement = (e) => {
        this.props.navigation.navigate('AnnouncementList');
        // Linking.openURL(Expo.Constants.manifest.extra.ANNOUNCEMENT_LINK); 
    }

    _renderAnnounceList() {
        const { latestAnnouncements } = this.props.announcementStore;
        return latestAnnouncements.map((announcement, index) => {
            const {
                uuid,
                korean_title,
                english_title,
                created,
                modified,
            } = announcement;

            let isKorean = true;
            const title = isKorean ? korean_title : english_title;
            return (
                <TouchableOpacity
                    key={uuid}
                    style={styles.row}
                    onPress={this._onPressAnnouncementById(uuid)}
                >
                    <View style={styles.column}>
                        <Text  style={styles.titleText}>{title}</Text>
                    </View>
                    <View style={styles.column}>
                        {/* <Text  style={styles.created}>{momentHelper.getLocaleDatetime(created)}</Text> */}
                        <Text
                            style={styles.dateText}>{momentHelper.getLocaleDatetime(modified)}</Text>
                    </View>
                </TouchableOpacity>
            )
        });
    }

    render() {
        return (
            <View style={[styles.container]}>
                <TouchableOpacity style={styles.header}
                    onPress={this._onPressAnnouncement}
                >
                    <Text style={styles.headerText}>
                        공지사항
                    </Text>
                    <Image
                        style={{ width: 10, resizeMode: 'contain' }}
                        source={
                            require('../../../assets/images/depositWithdraw/btn_arrow_small.png')
                        }
                    /> 
                </TouchableOpacity>
                <View>
                    {this._renderAnnounceList()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: '#dedfe0',
        height: 40,
        fontSize: 18,
    },
    headerText: {
        fontWeight: '600',
    },
    row: {
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#dedfe0',
        height: 40,
        paddingLeft: 10,
    },
    dateText: {
        color: 'grey',
        fontSize: 10,
    }

})
