import { Dimensions, Platform ,NativeModules} from 'react-native';
import { Header } from 'react-navigation';
const {StatusBarManager} = NativeModules
const X_WIDTH = 375;
const X_HEIGHT = 812;
const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');
const isIPhoneX =
  Platform.OS === 'ios' && (D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH);
const notchHeight = isIPhoneX ? 20 : 0;

export default {
  window: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  HEADER_HEIGHT:
    Platform.OS === 'android'
      ? Header.HEIGHT 
      : Header.HEIGHT,

  StatusBarHeight:Platform.OS==='android'?StatusBarManager.HEIGHT:StatusBarManager.getHeight((height)=>{return height})
};
