import { Colors } from '@/assets/styles';
import React, { ComponentType, memo } from 'react';
import { ModalProps } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'react-native-image-viewing/dist/@types';

interface AppScalableImageProps {
  images: ImageSource[];
  keyExtractor?: (imageSrc: ImageSource, index: number) => string;
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  onLongPress?: (image: ImageSource) => void;
  onImageIndexChange?: (imageIndex: number) => void;
  presentationStyle?: ModalProps['presentationStyle'];
  animationType?: ModalProps['animationType'];
  backgroundColor?: string;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  delayLongPress?: number;
  HeaderComponent?: ComponentType<{
    imageIndex: number;
  }>;
  FooterComponent?: ComponentType<{
    imageIndex: number;
  }>;
}

const DEFAULT_ANIMATION_TYPE = 'fade';
const DEFAULT_PRESENTATION_TYPE = 'fullScreen';

const AppScalableImage = ({
  images,
  keyExtractor,
  imageIndex = 0,
  visible,
  onRequestClose,
  onLongPress,
  onImageIndexChange,
  animationType = DEFAULT_ANIMATION_TYPE,
  presentationStyle = DEFAULT_PRESENTATION_TYPE,
  backgroundColor = Colors.black,
  swipeToCloseEnabled,
  doubleTapToZoomEnabled,
  delayLongPress,
  HeaderComponent,
  FooterComponent,
}: AppScalableImageProps) => {
  return (
    <ImageView
      images={images}
      keyExtractor={keyExtractor}
      imageIndex={imageIndex}
      visible={visible}
      onRequestClose={onRequestClose}
      HeaderComponent={HeaderComponent}
      FooterComponent={FooterComponent}
      onLongPress={onLongPress}
      onImageIndexChange={onImageIndexChange}
      presentationStyle={presentationStyle}
      animationType={animationType}
      backgroundColor={backgroundColor}
      swipeToCloseEnabled={swipeToCloseEnabled}
      doubleTapToZoomEnabled={doubleTapToZoomEnabled}
      delayLongPress={delayLongPress}
    />
  );
};

export default memo(AppScalableImage);
