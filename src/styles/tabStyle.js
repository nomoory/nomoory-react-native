import commonStyle from './commonStyle';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 34,
        // paddingTop: Constants.statusBarHeight,
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: commonStyle.color.brandBlue,
    },
    tabText: {
        fontWeight: '300',
        fontSize: 14,
        color: 'white',
        opacity: 0.8,
    },
    selectedTabText: {
        fontWeight: '900',
        color: 'white',
        opacity: 1,
    }
})