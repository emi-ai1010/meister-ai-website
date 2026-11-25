import React from "react";
import { Composition } from "remotion";
import { Portrait } from "./Portrait";
import { Reel } from "./Video";
import { DURATION } from "./script";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} durationInFrames={Math.ceil(DURATION * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Portrait" component={Portrait} durationInFrames={1} fps={30} width={1200} height={900} />
  </>
);
