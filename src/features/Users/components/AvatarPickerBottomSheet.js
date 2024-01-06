import {
  Colors,
  Fonts,
  Gutters,
  Layout,
  NavigationColors,
} from '@/assets/styles';
import { AppText } from '@/components/GlobalComponents';
import { PRIMARY_COLOR } from '@/components/constants';
import { patchAPI } from '@/components/utils/base_API';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import storage from '@react-native-firebase/storage';
import React, {
  Fragment,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TouchableOpacity, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Ion from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvatar } from '../userSlice';
import ModalLoading from '@/components/utils/ModalLoading';

const AvatarPickerBottomSheet = ({ onDismiss }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['35%', '50%'], []);
  const currentUser = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [modalLoading, setModalLoading] = useState(false);

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

  const uploadImageToFirebase = useCallback(async (filePath, uri) => {
    try {
      setModalLoading(true);

      //Upload Image
      await storage()
        .ref(filePath)
        .putFile(uri)
        .then(async () => {
          //Get URL
          await storage()
            .ref(filePath)
            .getDownloadURL()
            .then(url => {
              patchAPI({
                url: 'user/changeavatar',
                data: {
                  avatarLink: url,
                },
              })
                .then(res => {
                  if (res.status === 200) {
                    setModalLoading(false);
                    onDismiss();

                    dispatch(updateAvatar(res.data.newAvatarLink));

                    Toast.show({
                      type: 'success',
                      text1: 'Your avatar is updated.',
                    });
                  }
                })
                .catch(err => {
                  setModalLoading(false);
                  onDismiss();
                  console.log('Update Avatar: ', err);
                });
            });
        });
    } catch (error) {
      setModalLoading(false);
      onDismiss();

      console.log(error.message);
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
        !res.didCancel &&
          uploadImageToFirebase(
            `users/${currentUser.email}/avatar/${res.assets[0].fileName}`,
            res.assets[0].uri,
          );
      },
    );
  }, []);

  const pickImageFromCamera = useCallback(async () => {
    await launchCamera(
      {
        mediaType: 'photo',
      },
      res => {
        !res.didCancel &&
          uploadImageToFirebase(
            `users/${currentUser.email}/avatar/${res.assets[0].fileName}`,
            res.assets[0].uri,
          );
      },
    );
  }, []);

  return (
    <Fragment>
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

      <ModalLoading visible={modalLoading} />
    </Fragment>
  );
};

export default memo(AvatarPickerBottomSheet);
