import {createSwitchNavigator, createAppContainer} from 'react-navigation'

import Login from './Login'
import App from './App'

const Routes = createAppContainer(
    createSwitchNavigator({
        Login,
        App
    })
);

export default Routes;