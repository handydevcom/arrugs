import React, { Component, Fragment } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
} from 'react-native';

import Permissions from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

import NavigationService from '../routes/NavigationService';
import Images from '../constants/images';

const imgArr = ['rug1', 'rug2', 'rug3'];

export default class ViroSample extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this.state = {
      cameraPermission: '',
      systemVersion: null
    }
  }

  componentDidMount = () => {
    Permissions.request('camera').then((response) => {
      this.setState({ cameraPermission: response });
    });
    const systemVersion = DeviceInfo.getSystemVersion();
  }

  render() {
    const { cameraPermission } = this.state;
    return (
      <View style={localStyles.outer} >
        <View style={localStyles.inner} >

          <Text style={localStyles.titleText}>
            Choose a rug:
          </Text>
          <Fragment>
            {
              imgArr.map(item =>
                <TouchableHighlight
                  key={item}
                  onPress={() => NavigationService.navigate('CameraScreen', { cameraPermission, rugName: item })}
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
        </View>
      </View>
    )
  }
}

var localStyles = StyleSheet.create({
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
});
