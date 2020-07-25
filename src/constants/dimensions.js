import {Dimensions, PixelRatio,Platform} from 'react-native';
const X_WIDTH = 375;
const X_HEIGHT = 812;
const {height,width} = Dimensions.get('window')
const Width = widthPercent => {
  const screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  let Pixel = PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
  return parseFloat(Pixel.toFixed(2));
};
const Height = heightPercent => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  let Pixel = PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
  return parseFloat(Pixel.toFixed(2));
};
const isIphone =()=>{
  return Platform.OS==='ios'
}
const FontSize = (size) => {
  const screenWidth = Dimensions.get('window').width;
  return parseInt(size) * screenWidth * (1.8 - 0.002 * screenWidth) / 400;
}
const isIphoneX=()=>{
 return ((Platform.OS==='ios') && (height===X_HEIGHT && width===X_WIDTH))
}
export {
  Width,
  Height,
  FontSize,
  isIphoneX,
  isIphone
};