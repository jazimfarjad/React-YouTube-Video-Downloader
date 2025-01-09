import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleDownload = async () => {
    if (!videoUrl) {
      setMessage('Please enter a valid video URL.');
      return;
    }

    try {
      // Sending the video URL to the backend
      const response = await axios.post('http://localhost:5000/download', { videoUrl });

      // On success, show message
      setMessage(response.data.message);

      // Trigger the download dialog
      const link = document.createElement('a');
      link.href = response.data.filePath;  // The file path returned by backend
      link.download = '';  // This triggers the download dialog
      link.click();
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div>
      <h1>YouTube Video Downloader</h1>
      <input
        type="text"
        placeholder="Enter video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <br />
      <button onClick={handleDownload}>Download Video</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
