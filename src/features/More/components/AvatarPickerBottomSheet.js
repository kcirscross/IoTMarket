import {
  Colors,
  Fonts,
  Gutters,
  Layout,
  NavigationColors,
} from '@/assets/styles';
import { AppText } from '@/components/GlobalComponents';
import { PRIMARY_COLOR } from '@/components/constants';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Ion from 'react-native-vector-icons/Ionicons';

const AvatarPickerBottomSheet = ({ onDismiss, onChange }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['35%', '50%'], []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="collapse"
        enableTouchThrough
        onPress={onDismiss}
        appearsOnIndex={1}
      />
    ),
    [],
  );

  const handleSheetChange = useCallback(index => {
    if (index === -1) {
      onDismiss();
    }
  }, []);

  const pickImageFromGallery = useCallback(async () => {
    await launchImageLibrary(
      {
        mediaType: 'photo',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      res => {
        !res.didCancel && onChange(res.assets[0]);

        onDismiss();
      },
    );
  }, []);

  const pickImageFromCamera = useCallback(async () => {
    await launchCamera(
      {
        mediaType: 'photo',
      },
      res => {
        !res.didCancel && onChange(res.assets[0]);

        onDismiss();
      },
    );
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={[
        Layout.regularDropShadow,
        { backgroundColor: NavigationColors.background },
      ]}
      handleIndicatorStyle={{
        backgroundColor: Colors.textGray800,
      }}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
      enablePanDownToClose
    >
      <View style={[Gutters.smallHPadding, Gutters.tinyVPadding]}>
        <View style={Layout.rowHCenter}>
          <AppText style={Fonts.titleSmall}>Choose your image from?</AppText>

          <View style={Layout.fill} />

          <TouchableOpacity onPress={onDismiss}>
            <Ion name="close-circle-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={pickImageFromGallery}
          style={[Layout.selfCenter, Layout.center, Gutters.smallVPadding]}
        >
          <AppText style={[Fonts.textBold, Gutters.tinyBPadding]}>
            Gallery
          </AppText>

          <Ion name="images-outline" size={64} color={PRIMARY_COLOR} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickImageFromCamera}
          style={[Layout.selfCenter, Layout.center, Gutters.smallVPadding]}
        >
          <AppText style={[Fonts.textBold, Gutters.tinyBPadding]}>
            Camera
          </AppText>

          <Ion name="camera-outline" size={64} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default memo(AvatarPickerBottomSheet);
