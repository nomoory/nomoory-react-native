import { NavigationActions } from 'react-navigation';

let _navigator;

const setTopLevelNavigator = function(navigatorRef) {
    _navigator = navigatorRef;
}

const navigate = function(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}
// add other navigation functions that you need and export them

export default {
    navigate,
    setTopLevelNavigator,
};