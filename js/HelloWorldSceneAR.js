'use strict';

import React, { Component } from 'react';

import { StyleSheet } from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroConstants,

  ViroBox,
  ViroMaterials,

  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,

  ViroARPlaneSelector,
  ViroImage
} from 'react-viro';

import Images from '../src/constants/images';

export default class HelloWorldSceneAR extends Component {

  constructor() {
    super();

    // Set initial state here
    this.state = {
      text : "Initializing AR..."
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
  }

  render() {
    const { rugName } = this.props.sceneNavigator.viroAppProps;
    return (
      <ViroARScene displayPointCloud anchorDetectionTypes={[ 'None', 'PlanesHorizontal', 'PlanesVertical']} onTrackingUpdated={this._onInitialized} >
        <ViroARPlaneSelector alignment={"Horizontal"}>
          <ViroImage
            height={.9}
            width={.9}
            // placeholderSource={require("./res/spinner.gif")}
            source={Images[`${rugName}`]}
            rotation={[-90,0,0]}
          />
        </ViroARPlaneSelector>
      </ViroARScene>
    );
  }

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text : "Demo!"
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: 'green',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('./res/grid_bg.jpg'),
  },
});

module.exports = HelloWorldSceneAR;
