import { Dimensions, PixelRatio } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const widthBaseScale = SCREEN_WIDTH / 430;
const heightBaseScale = SCREEN_HEIGHT / 932;
function normalize(size: number, based = 'width') {
  const newSize = based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

//for width  pixel
export function widthPixel(size: number) {
  return normalize(size, 'width');
}
//for height  pixel
export function heightPixel(size: number) {
  return normalize(size, 'height');
}
//for font  pixel
export function Size(size: number) {
  size += SCREEN_HEIGHT - SCREEN_WIDTH <= 270 ? 0 : 3.7;
  if (SCREEN_WIDTH < SCREEN_HEIGHT) {
    if (SCREEN_HEIGHT - SCREEN_WIDTH <= 150) return widthPixel(size) * 0.73;
    if (SCREEN_WIDTH >= 800) return widthPixel(size) * 0.68;
    if (SCREEN_WIDTH >= 700) return widthPixel(size) * 0.73;
    if (SCREEN_WIDTH >= 600) return widthPixel(size) * 0.83;
    return widthPixel(size);
  } else {
    if (SCREEN_WIDTH >= 1400) return widthPixel(size) * 0.3;
    return widthPixel(size) * 0.5;
  }
}
//for Margin and Padding vertical pixel
export function pixelSizeVertical(size: number) {
  return heightPixel(size);
}
//for Margin and Padding horizontal pixel
export function pixelSizeHorizontal(size: number) {
  return widthPixel(size);
}
