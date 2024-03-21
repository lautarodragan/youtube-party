import Button from "@mui/material/Button";
import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { UserList } from './UserList'
import { useWebSocket } from './useWebSocket'
import { YouTubeURLInput } from './YouTubeURLInput'
import { VideoPlayer, VideoPlayerRef } from './VideoPlayer'

const serverUrl = process.env.REACT_APP_SERVER_URL || 'ws://localhost:8080'

// randomly generate a user ID every time you join the room
// you don't need persistence between browser reloads or different sessions,
// so a random ID will do to distinguish between two tabs with the Youtube Watch Party Open
const userId = uuidv4();

function App() {
  const [joined, setJoined] = useState(false)

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to the Youtube Watch Party. Your ID for this session is {userId}.
        </p>

        { !joined && <Button onClick={() => setJoined(true)}>join the party!</Button>}
        { joined && <Party/> }
      </header>
    </div>
  );
}

export const Party = () => {
  const [videoId, setVideoId] = useState('')
  const videoRef = useRef<VideoPlayerRef>()

  const onMessageLoad = (videoId: string, playTime: number) => {
    setVideoId(videoId)
    videoRef.current?.seekTo(playTime)
  }

  const onMessagePlay = (playTime: number) => {
    console.log('onMessagePlay', playTime)
    videoRef.current?.seekTo(playTime)
    videoRef.current?.play()
  }

  const onMessagePause = () => {
    videoRef.current?.pause()
  }

  const { users, send } = useWebSocket(serverUrl, userId, onMessageLoad, onMessagePlay, onMessagePause)

  const onUrlSubmit = (videoId: string) => {
    setVideoId(videoId)
    send({
      action: 'load',
      videoId,
    })
  }

  const onPlay = () => {
    send({
      action: 'play',
      currentPlayTime: videoRef.current?.getCurrentTime(),
    })
  }

  const onPause = () => {
    send({
      action: 'pause',
      currentPlayTime: videoRef.current?.getCurrentTime(),
    })
  }

  return (
    <div>
      <Button> Add a youtube video</Button>
      <YouTubeURLInput onSubmit={onUrlSubmit} />

      { videoId && <VideoPlayer videoId={videoId} onPlay={onPlay} onPause={onPause} ref={videoRef} /> }

      <UserList users={users} />
    </div>
  )
}


export default App;
