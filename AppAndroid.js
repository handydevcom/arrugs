import React, { Component, Fragment } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  Button,
  TouchableOpacity,
} from 'react-native';

import {
  ViroARSceneNavigator,
  ViroUtils
} from 'react-viro';

import Permissions from 'react-native-permissions'
import Images from './src/constants/images';

const screenWidth = Dimensions.get('window').width;

var sharedProps = {
  apiKey:"B75F6C7C-A6E4-46FC-BCD2-B843AF151061",
}

var CameraAndroid = require('./src/screens/CameraAndroid');

var UNSET = "UNSET";
var AR_NAVIGATOR_TYPE = "AR";

var defaultNavigatorType = UNSET;
var isARSupportedOnDevice = ViroUtils.isARSupportedOnDevice;

const imgArr = ['rug1', 'rug2', 'rug3'];

export default class ViroSample extends Component {
  constructor() {
    super();

    this.state = {
      navigatorType : defaultNavigatorType,
      sharedProps : sharedProps,
      rugName: '',
      cameraPermission: '',
      showEnableButton: false,
      isArSupported: false,
    }
    this._getExperienceSelector = this._getExperienceSelector.bind(this);
    this._getARNavigator = this._getARNavigator.bind(this);
    this._getExperienceButtonOnPress = this._getExperienceButtonOnPress.bind(this);
    this._exitViro = this._exitViro.bind(this);
    this.buttonRef = React.createRef();
  }

  componentWillMount = () => {
    isARSupportedOnDevice(this.handleARNotSupported, this.handleARSupported);
    // Permissions.request('camera').then((response) => {
    //   this.setState({ cameraPermission: response });
    // });
  }

  handleARNotSupported = () => {
    this.setState({ isArSupported: false })
  }

  handleARSupported = () => {
    this.setState({ isArSupported: true },
      () => Permissions.request('camera').then((response) => {
      this.setState({ cameraPermission: response });
    }));
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

  _getExperienceSelector() {
    const { isArSupported } = this.state;
    return (
      <View style={localStyles.outer} >
        <View style={localStyles.inner} >
          {
            isArSupported && <Fragment>
              <Text style={localStyles.titleText}>
                Choose a rug, please:
              </Text>
              <Fragment>
                {
                  imgArr.map(item =>
                    <TouchableHighlight
                      key={item}
                      onPress={() => {
                        this.setState({ rugName: item })
                        this._getExperienceButtonOnPress(AR_NAVIGATOR_TYPE)
                      }}
                    >
                      <Image
                        source={Images[`${item}`]}
                        resizeMode="contain"
                        style={{
                          height: 160,
                          width: 300,
                          transform: [{ rotate: '90deg'}]
                        }}
                      />
                    </TouchableHighlight>
                  )
                }
              </Fragment>
            </Fragment>
          }
          {
            !isArSupported && <Text style={localStyles.titleText}>
              Your device does not support AR Core technology
            </Text>
          }
        </View>
      </View>
    );
  }

  enableUpdate = () => {
    this.setState({ showEnableButton: true });
  }

  _getARNavigator() {
    const { rugName, showEnableButton } = this.state;
    return (
      <Fragment>
        <View style={{ flex: 1 }}>
          <ViroARSceneNavigator
            style={{ flex: 1 }} 
            {...this.state.sharedProps}
            initialScene={{ scene: CameraAndroid }}
            viroAppProps={{ rugName, showEnableButton, forwardedRef: this.buttonRef, enableUpdate: this.enableUpdate }}
          />
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
                  this.setState({ rugName: '', showEnableButton: false })
                  this._getExperienceButtonOnPress(UNSET)
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
        </View>
        {showEnableButton && <TouchableOpacity
            style={{ opacity: 0.5, backgroundColor: '#fff', position: 'absolute', bottom: 30, left: 10, height: 30, width: 150, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              if (showEnableButton) {
                this.setState({ showEnableButton: false });
                this.buttonRef.current.reset();
              }
            }}
          >
            <Text style={{ fontSize: 16}}>Enable Live Update</Text>
          </TouchableOpacity>}
      </Fragment>
    );
  }


  // This function returns an anonymous/lambda function to be used
  // by the experience selector buttons
  _getExperienceButtonOnPress(navigatorType) {
    this.setState({
      navigatorType : navigatorType
    })
  }

  // This function "exits" Viro by setting the navigatorType to UNSET.
  _exitViro() {
    this.setState({
      navigatorType : UNSET
    })
  }

  // Replace this function with the contents of _getVRNavigator() or _getARNavigator()
  // if you are building a specific type of experience.
  render() {
    const { cameraPermission } = this.state;
    if (this.state.navigatorType == AR_NAVIGATOR_TYPE) {
      if (cameraPermission === 'authorized') {
        return(
          <Fragment>
            {
              this._getARNavigator()
            }
          </Fragment>
        )
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
    return (
      <Fragment>
        {
          this._getExperienceSelector()
        }
      </Fragment>
    )
  }
}

var localStyles = StyleSheet.create({
  viroContainer :{
    flex : 1,
    backgroundColor: "black",
  },
  outer : {
    flex : 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: "black",
  },
  inner: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "black",
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color:'#fff',
    textAlign:'center',
    fontSize : 25
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontSize : 20
  },
  buttons : {
    height: 80,
    width: 150,
    // paddingTop:20,
    // paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'rgba(255,0,0,0.3)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  exitButton : {
    height: 50,
    width: 100,
    paddingTop:10,
    paddingBottom:10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  }
});

module.exports = ViroSample
