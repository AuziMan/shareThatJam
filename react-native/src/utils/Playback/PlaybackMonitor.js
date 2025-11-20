import React, { useEffect } from 'react';
import { getPlaybackState, getPlaybackData } from '../Playback/PlaybackServices';

const NowPlayingMonitor = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      getPlaybackState();
      getPlaybackData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default NowPlayingMonitor;
