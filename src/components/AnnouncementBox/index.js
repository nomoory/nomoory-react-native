import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import momentHelper from '../../utils/momentHelper';
import commonStyle from '../../styles/commonStyle';

@withNavigation
@inject('announcementStore')
@observer
export default class AnnouncementBox extends Component {
    _onPressAnnouncementById = (uuid) => () => {
        this.props.navigation.navigate('AnnouncementDetail', {
            uuid,
            from: 'Etc',
        });
    }

    _onPressAnnouncement = (e) => {
        this.props.navigation.navigate('AnnouncementList');
        // Linking.openURL(Expo.Constants.manifest.extra.ANNOUNCEMENT_LINK); 
    }

    _renderAnnounceList() {
        const latestAnnouncements = this.props.announcementStore.latestAnnouncements || [];
        return (
            <FlatList 
                style={[
                    // styles.scrollViewContainer,
                    // styles.itemsContainer
                ]}
                data={latestAnnouncements.length ? latestAnnouncements : []}
                // refreshing={this.state.refreshing}
                // onRefresh={this.onRefresh}
                enableEmptySections={true}
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
                            style={styles.announcementRrow}
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
                    );
                }}
                // emptyView={this._renderEmptyView}
            />
        )
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
        borderColor: commonStyle.color.borderColor,
        height: 40,
        fontSize: 18,
    },
    headerText: {
        fontWeight: '600',
    },
    row: {
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: commonStyle.color.borderColor,
        height: 46,
        paddingLeft: 10,
    },
    announcementRrow: {
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: commonStyle.color.borderColor,
        height: 40,
        paddingLeft: 10,
    },
    titleText: {
        fontSize: 13,
    },
    dateText: {
        color: 'grey',
        fontSize: 10,
    }

})
