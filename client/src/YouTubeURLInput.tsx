import React, { useState } from 'react'

const sampleVideos = [
  'https://www.youtube.com/watch?v=kpk2tdsPh0A',
  'https://www.youtube.com/watch?v=6EKreQ5HD4w',
  'https://www.youtube.com/watch?v=qWXnt2Z2D1E',
  'https://www.youtube.com/watch?v=0f0OvgfWrFQ',
]

interface YouTubeURLInputProps {
  readonly onSubmit: (videoId: string) => void;
}

export const YouTubeURLInput = ({ onSubmit }: YouTubeURLInputProps) => {
  const [url, setUrl] = useState<string>('')

  const onSubmitInternal = () => {
    try {
      const parsedUrl = new URL(url)
      const searchParams = new URLSearchParams(parsedUrl.search)
      const v = searchParams.get('v')
      if (v)
        onSubmit(v)
    } catch (error) {
      // useRef & set error state
    }
  }

  const onRandom = () => {
    setUrl(sampleVideos[Math.floor(Math.random() * sampleVideos.length)])
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Add a YouTube URL to watch with your friends"
        value={url}
        onChange={event => setUrl(event.currentTarget.value)}
      />
      <button onClick={onSubmitInternal} >Play</button>
      <button onClick={onRandom}>Random</button>
    </div>
  )
}
