import * as Headless from "@headlessui/react";
import React, { forwardRef } from "react";
import { Link as UpstreamLink } from "react-router-dom";

export const Link = forwardRef(function Link(
  props: React.ComponentPropsWithoutRef<typeof UpstreamLink>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <UpstreamLink {...props} ref={ref} />
    </Headless.DataInteractive>
  );
});
