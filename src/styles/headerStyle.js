import commonStyle from './commonStyle';
export default {
    blue: {
        headerStyle: {
            backgroundColor: commonStyle.color.coblicBlue,
            height: 38,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: '400',
        },    
    },
    white: {
        headerStyle: {
            backgroundColor: commonStyle.color.white,
            height: 38,
            borderBottomWidth: 0
        },
        headerTintColor: commonStyle.color.main,
        headerTitleStyle: {
            fontWeight: '400',
        },
    }
}