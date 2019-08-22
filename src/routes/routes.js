import { createStackNavigator, createAppContainer } from 'react-navigation';
import CameraScreen from '../screens/CameraScreen';
import MainScreen from '../screens/MainScreen'

const MainStack = createStackNavigator({
  MainScreen,
  CameraScreen
});

export default createAppContainer(MainStack);

