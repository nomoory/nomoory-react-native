import commonStyle from './commonStyle';

const commonHeaderStyle = {
    elevation: 0, 
    height: 38,
}
export default {
    white: {
        headerStyle: {
            ...commonHeaderStyle,
            backgroundColor: commonStyle.color.white,
            borderBottomWidth: 0,
            shadowOpacity: 0,
            shadowOffset: {
                height: 0,
            },
            shadowRadius: 0,
        },
        headerTintColor: commonStyle.color.mainThemeColor,
        headerTitleStyle: {
            fontSize: 17,
            fontWeight: '400',
        },
    },
    blue: {
        headerStyle: {
            ...commonHeaderStyle,
            height: 38,
            backgroundColor: commonStyle.color.brandBlue,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontSize: 17,
            fontWeight: '400',
        },    
    },
}