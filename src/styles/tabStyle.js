import commonStyle from './commonStyle';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 44,
        // paddingTop: Constants.statusBarHeight,
    },
    selectedTabItem: {
        borderBottomWidth: 2,
        borderBottomColor: commonStyle.color.coblicBlue,
        fontWeight: '700'
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 13,
        backgroundColor: 'white',
        borderBottomWidth: 2,
        borderBottomColor: commonStyle.color.coblicPaleGrey,
    },
    tabText: {
        fontWeight: '600', 
        fontSize: 16
    },
    selectedTabText: {
        fontWeight: '700',
        fontSize: 16
    }
})