import { Dimensions } from "react-native";
import { heightMobileUI, widthMobileUI } from "../constant";

export const responsiveWidth = (width) => {
  return (Dimensions.get("window").width * width) / widthMobileUI;
};

export const responsiveHeight = (height) => {
  return (Dimensions.get("window").height * height) / heightMobileUI;
};

export const filterWishlistProduct = (val, arr) => {
  if (val[1]?.length) {
    val[1]?.map((val2) => {
      if (val2) {
        arr.push(val2);
      }
    });
  } else {
    arr.push(val[1][Object.keys(val[1])]);
  }
};
