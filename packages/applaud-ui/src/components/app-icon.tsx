import React, { CSSProperties } from "react";
import { Props, FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface AppIconProps extends Props {
  standardLeftMargin?: boolean;
  standardRightMargin?: boolean;
  wideLeftMargin?: boolean;
  wideRightMargin?: boolean;
}

/* AppIcon is a resuable component that provides additional and consistent styling for Icons. Wraps the FontAwesomeIcon. */

const AppIcon = (props: AppIconProps) => {
  const {
    standardLeftMargin,
    standardRightMargin,
    wideLeftMargin,
    wideRightMargin,
    ...rest
  } = props;
  const styles: CSSProperties = {};
  if (standardLeftMargin) {
    styles.marginLeft = ".5em";
  } else if (wideLeftMargin) {
    styles.marginLeft = "1em";
  }
  if (standardRightMargin) {
    styles.marginRight = ".5em";
  } else if (wideRightMargin) {
    styles.marginRight = "1em";
  }

  return <FontAwesomeIcon {...rest} style={styles} />;
};

export default AppIcon;