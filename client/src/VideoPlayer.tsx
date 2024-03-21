import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube'
import React, { useRef, useImperativeHandle, forwardRef } from "react";

interface VideoPlayerProps {
  readonly videoId: string
  readonly onPlay: () => void
  readonly onPause: () => void
}

export interface VideoPlayerRef {
  readonly play: () => void
  readonly pause: () => void
  readonly getCurrentTime: () => number
  readonly seekTo: (seconds: number) => void
}

export const VideoPlayer = forwardRef((
  { videoId, onPlay, onPause }: VideoPlayerProps,
  ref,
) => {
  const playerRef = useRef<YouTubePlayer>()
  const playAsapRef = useRef(false)
  const seekToAsapRef = useRef(0)

  const play = () => playerRef.current?.playVideo()
  const seekTo = (seconds: number) => playerRef.current?.seekTo(seconds, true)

  useImperativeHandle(ref, () => ({
    play: () => {
      console.log('imperativeHandle play')
      play()
      playAsapRef.current = true
    },
    pause: () => playerRef.current?.pauseVideo(),
    getCurrentTime: () => playerRef.current?.getCurrentTime(),
    seekTo: (seconds: number) => {
      console.log('imperativeHandle seekTo', seconds)
      seekTo(seconds)
      seekToAsapRef.current = seconds
    },
  }))

  const onVideoReady = (event: YouTubeEvent) => {
    console.log('onVideoReady', event, event.target.getPlayerState())
    playerRef.current = event.target

    if (playAsapRef.current)
      play()

    if (seekToAsapRef.current)
      seekTo(seekToAsapRef.current)
  }

  const onVideoPlay = (event: YouTubeEvent) => {
    console.log('onVideoPlay', event)
  }

  const onVideoPause = (event: YouTubeEvent) => {
    console.log('onVideoPause', event)
  }

  const onVideoEnd = (event: YouTubeEvent) => {
    console.log('onVideoEnd', event)
  }

  const onVideoError = (event: YouTubeEvent) => {
    console.log('onVideoError', event)
  }

  const onVideoStateChange = (event: YouTubeEvent) => {
    console.log('onVideoStateChange', event)
  }

  const onVideoPlaybackRateChange = (event: YouTubeEvent) => {
    console.log('onVideoPlaybackRateChange', event)
  }

  const onPlayClick = () => {
    if (!playerRef.current)
      return
    playerRef.current.playVideo()
    onPlay()
  }

  const onPauseClick = () => {
    if (!playerRef.current)
      return
    playerRef.current.pauseVideo()
    onPause()
  }

  return (
    <div>
      <YouTube
        videoId={videoId}
        onReady={onVideoReady}
        onPlay={onVideoPlay}
        onPause={onVideoPause}
        onEnd={onVideoEnd}
        onError={onVideoError}
        onStateChange={onVideoStateChange}
        onPlaybackRateChange={onVideoPlaybackRateChange}
        opts={{ playerVars: { controls: 0, autoplay: 0 } }}
      />

      <button onClick={onPlayClick}>Play</button>
      <button onClick={onPauseClick}>Pause</button>

    </div>
  )
})
