import commonStyle from './commonStyle';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 30,
        // paddingTop: Constants.statusBarHeight,
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0042b7',
    },
    tabText: {
        fontWeight: '400', 
        fontSize: 13,
        color: 'white',
    },
    selectedTabText: {
        fontWeight: '900',
        fontSize: 13,
        color: 'white',
    }
})