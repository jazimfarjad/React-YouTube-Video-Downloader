const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');  // CORS middleware

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

app.use(express.json());

app.post('/download', (req, res) => {
    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ error: "Video URL is required" });
    }

    // Define the location for saving the file (let it be the default download folder)
    const downloadFolder = path.resolve(__dirname, 'downloads');  // You can also set a default folder like this

    // Construct the command to run yt-dlp and save the file
    const command = `yt-dlp -f mp4 -o "${downloadFolder}/%(title)s.%(ext)s" ${videoUrl}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: `Error: ${stderr}` });
        }

        // Construct the file path based on the downloaded file's name
        const filePath = path.join(downloadFolder, `${stdout.match(/Destination: (.*)\.mp4/)[1]}.mp4`);

        // Send the file path to the frontend
        res.json({ message: 'Download Complete!', filePath });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
