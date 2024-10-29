import React from "react";

export const Slot = (
  props: React.PropsWithChildren<Record<string, unknown>>
) => {
  const { children, ...otherProps } = props;
  return React.cloneElement(
    children as React.ReactElement<
      Record<string, unknown>,
      string | React.JSXElementConstructor<Record<string, unknown>>
    >,
    otherProps
  );
};
