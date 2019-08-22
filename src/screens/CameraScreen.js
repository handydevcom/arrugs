import React, { Component } from 'react';
import { View, Image, Dimensions, Button, Platform, TouchableOpacity, Text, Alert, PanResponder } from 'react-native';
import { ARKit } from 'react-native-arkit';
import Permissions from 'react-native-permissions';
import NavigationService from '../routes/NavigationService';
import Images from '../constants/images';

const screenWidth = Dimensions.get('window').width;

export default class CameraScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      anchor: null,
      rugName: '',
      cameraPermission: '',
      error: null,
      dX: 0,
      stopLiveUpdate: false,
      touches: null,
      rugWidth: 0,
      rugHeight: 0,
    }
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (event, gestureState) => {
        gestureState.numberActiveTouches === 1 && this.setState({ dX: this.state.dX + gestureState.dx / 1000 });
        gestureState.numberActiveTouches === 2 &&
        this.setState({
          touches: event.nativeEvent.touches,
        });
      },
    })
  }

  calcDistance = (x1, y1, x2, y2) => {
    let dx = Math.abs(x1 - x2)
    let dy = Math.abs(y1 - y2)
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  }

  componentDidMount = () => {
    const rugName = this.props.navigation.getParam('rugName');
    const cameraPermission = this.props.navigation.getParam('cameraPermission');
    this.setState({ rugName, cameraPermission });
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { rugWidth, rugHeight, touches, initialRugWidth, initialRugHeight } = this.state;
    if ((touches && touches.length === 2) && (prevState.touches && prevState.touches.length === 2)) {
      const currentTouch1 = touches[0];
      const currentTouch2 = touches[1];
      const prevTouches1 = prevState.touches[0];
      const prevTouches2 = prevState.touches[1];
      const currentDistance = this.calcDistance(currentTouch1.pageX, currentTouch1.pageY, currentTouch2.pageX, currentTouch2.pageY);
      const prevDistance = this.calcDistance(prevTouches1.pageX, prevTouches1.pageY, prevTouches2.pageX, prevTouches2.pageY);
      const widthPart = initialRugWidth * 0.2;
      const heightPart = initialRugHeight * 0.2
      if (currentDistance > prevDistance) {
        this.setState({
          rugWidth: rugWidth + 0.01,
          rugHeight: rugHeight + 0.01,
        });
      } else if (currentDistance < prevDistance) {
        if (rugWidth < widthPart || rugHeight < heightPart) return;
        this.setState({
          rugWidth: rugWidth - 0.01,
          rugHeight: rugHeight - 0.01,
        })
      }
    }
  }

  openSettings = async () => {
    if (Platform.OS === 'ios') {
      Permissions.openSettings();
    } else {
      Permissions.request('camera').then((response) => {
        this.setState({ cameraPermission: response });
      });
    }
  }


  render() {
    const {
      anchor, rugName, cameraPermission, error,
      stopLiveUpdate, dX, rugWidth, rugHeight,
    } = this.state;
    const { position, alignment, center, extent, eulerAngles } = anchor !== null && anchor;
    const eulerAnglesY = (anchor && eulerAngles.y) + dX
    if (cameraPermission === 'authorized') {
      return (
        <View
          style={{ flex: 1 }}
          {...this.panResponder.panHandlers}
        >
          <ARKit
            style={{ flex: 1 }}
            planeDetection={ARKit.ARPlaneDetection.Horizontal}
            onPlaneDetected={anchor => {
              !stopLiveUpdate && this.setState({
                anchor,
                rugWidth: anchor.extent.x,
                rugHeight: anchor.extent.z,
                initialRugWidth: anchor.extent.x,
                initialRugHeight: anchor.extent.z,
              })
            }}
            onPlaneUpdated={anchor => {
              !stopLiveUpdate && this.setState({
                anchor,
                rugWidth: anchor.extent.x,
                rugHeight: anchor.extent.z,
              })
            }}
            onARKitError={e => {
              this.setState({ error: JSON.stringify(e.userInfo.NSLocalizedFailureReason)}, () => error && Alert.alert(
                '',
                error,
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
              ))
            }}
          >
            {
              anchor && rugName !== '' &&
              <ARKit.Plane
                position={{ x: position.x, y: position.y, z: position.z }}
                shape={{ width: rugWidth, height: rugHeight }}
                eulerAngles={{ x: eulerAngles.x - Math.PI / 2, y: eulerAnglesY, z: eulerAngles.z }}
                material={{
                  diffuse: { path: `assets/${rugName}`, intensity: 1 },
                }}
              />
            }
          </ARKit>
          <View style={{
            width: '100%',
            height: 30,
            justifyContent: 'center',
            alignItems: 'flex-start',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            flex: 1,
          }}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'flex-start'}}
              onPress={() => {
                this.setState({ error: '' })
                NavigationService.goBack()
              }}
            >
              <Image resizeMode='contain' source={Images.backArrow} style={{ height: 20, width: 30 }} />
              <Text style={{color: '#fff', fontSize: 16}}>Back</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={Images.logo}
            style={{
              opacity: 0.5,
              width: screenWidth,
              height: 0.18 * screenWidth,
              position: 'absolute',
              top: 30,
              left: 0,
              right: 0,
              flex: 1,
            }}
          />
          <TouchableOpacity
            style={{ opacity: 0.5, backgroundColor: '#fff', position: 'absolute', bottom: 30, left: 10, height: 30, width: 150, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.setState({ stopLiveUpdate: !stopLiveUpdate })
            }}
          >
            <Text style={{ fontSize: 16}}>{`${!stopLiveUpdate ? 'Disable' : 'Enable'} Live Update`}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Button
        onPress={this.openSettings}
        title={Platform.OS === 'android' ? 'Enable Camera' : 'Settings'}
        color="#841584"
      />
    </View>
  }
}