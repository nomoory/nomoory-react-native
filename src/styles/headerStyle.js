import commonStyle from './commonStyle';
export default {
    blue: {
        headerStyle: {
            backgroundColor: commonStyle.color.coblicBlue,
            height: 50,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: '500',
        },    
    },
    white: {
        headerStyle: {
            backgroundColor: commonStyle.color.white,
            height: 50,
            borderBottomWidth: 0
        },
        headerTintColor: 'black',
        headerTitleStyle: {
            fontWeight: '500',
        },
    }
}