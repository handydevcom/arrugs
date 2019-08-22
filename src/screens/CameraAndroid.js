'use strict';

import React, { Component } from 'react';
import {
  ViroARScene,
  ViroARPlaneSelector,
  ViroImage,
} from 'react-viro';

import Images from '../constants/images';

class CameraAndroid extends Component {

  constructor() {
    super();
    this.state = {
      text: "Initializing AR...",
      rotation: [-90, 0, 0],
      scale: [1, 1, 1],
      showImage: false,
      planeDimensions: {
        position: [0, 0, 0],
        width: 0,
        height: 0,
      }
    };
  }

  _onRotate = (rotateState, rotationFactor, source) => {
    if (rotateState == 3) {
      this.setState({
        rotation : [this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]
      });
      return;
    }

    this.arNodeRef.setNativeProps({rotation:[this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]});
  }

  _onPinch = (pinchState, scaleFactor, source) => {
    var newScale = this.state.scale.map((x)=>{return x * scaleFactor})

    if(pinchState == 3) {
      this.setState({
        scale : newScale
      });
      return;
    }

    this.arNodeRef.setNativeProps({scale: newScale});
  }
  

  render() {
    const { rugName, showEnableButton, forwardedRef, enableUpdate } = this.props.sceneNavigator.viroAppProps;
    const { planeDimensions } = this.state;
    return (
      <ViroARScene displayPointCloud={!showEnableButton} anchorDetectionTypes={[ 'None', 'PlanesHorizontal']}>
        <ViroARPlaneSelector
          alignment={"Horizontal"}
          ref={forwardedRef}
          onPlaneSelected={(anchor) => {
            // alert(JSON.stringify(anchor))
            enableUpdate()
            this.setState({
              rotation: [-90, 0, 0],
              scale: [1, 1, 1],
              planeDimensions: {
                position: [anchor.center[0], anchor.center[1], anchor.center[2]],
                height: anchor.height,
                width: anchor.width
              }
            })
          }}
        >
          <ViroImage
            source={Images[`${rugName}`]}
            rotation={this.state.rotation}
            scale={this.state.scale}
            onRotate={this._onRotate}
            onPinch={this._onPinch}
            ref={node => this.arNodeRef = node}
            height={planeDimensions.height}
            width={planeDimensions.width}
            position={planeDimensions.position}
          />
        </ViroARPlaneSelector>
      </ViroARScene>
    );
  }
}

export default CameraAndroid;


module.exports = CameraAndroid;
