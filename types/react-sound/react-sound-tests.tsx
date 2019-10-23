import ReactSound, { PlayStatus } from "react-sound";
import * as React from "react";

const ReactSoundRequiredOptions: JSX.Element = (
    <ReactSound
        url="http://test.com"
        playStatus={PlayStatus.Stopped}
    />
);

const callbackFn = () => ({});

const ReactSoundAllOptions: JSX.Element = (
    <ReactSound
        url="http://test.com/audio.mp3"
        playStatus={PlayStatus.Paused}
        playFromPosition={0}
        position={0}
        volume={0}
        playbackRate={0}
        autoLoad
        loop={false}
        onError={callbackFn}
        onLoading={callbackFn}
        onLoad={callbackFn}
        onPlaying={callbackFn}
        onPause={callbackFn}
        onResume={callbackFn}
        onStop={callbackFn}
        onFinishedPlaying={callbackFn}
        onBufferChange={callbackFn}
    />
);