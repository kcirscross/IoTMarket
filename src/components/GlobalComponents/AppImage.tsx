import React, { memo } from 'react';
import FastImage, { FastImageProps } from 'react-native-fast-image';

const AppImage = ({
  source,
  style,
  fallback = false,
  onLoadStart,
  onLoadEnd,
  onError,
  resizeMode,
  ...restProps
}: FastImageProps) => {
  return (
    <FastImage
      style={style}
      source={source}
      resizeMode={resizeMode}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      onError={onError}
      fallback={fallback}
      {...restProps}
    />
  );
};

export default memo(AppImage);
