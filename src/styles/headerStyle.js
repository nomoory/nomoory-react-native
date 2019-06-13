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
            borderBottomWidth: 0,
            shadowOpacity: 0,
            shadowOffset: {
                height: 0,
            },
            shadowRadius: 0,
        },
        headerTintColor: commonStyle.color.mainThemeColor,
        headerTitleStyle: {
            fontWeight: '400',
        },
    }
}