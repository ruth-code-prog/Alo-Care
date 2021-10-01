import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Banner, Banner2 } from "../../../assets";
import { SliderBox } from "react-native-image-slider-box";
import { responsiveHeight, responsiveWidth, colors } from "../../../utils";

export default class BannerSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: props?.data,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <SliderBox
          images={this.state.images}
          autoplay
          circleLoop
          sliderBoxHeight={responsiveHeight(172)}
          ImageComponentStyle={styles.slider}
          dotStyle={styles.dotStyle}
          imageLoadingColor={colors.primary}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
  },
  slider: {
    borderRadius: 10,
    width: responsiveWidth(420),
    marginRight: 10,
  },
  dotStyle: {
    width: 10,
    height: 5,
    borderRadius: 5,
  },
});
