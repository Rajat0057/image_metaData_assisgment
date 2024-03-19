const express = require('express');
const multer = require('multer');
const exif = require('exif-parser');
const cors = require('cors'); // Import cors middleware

const app = express();
const PORT = 5000;
app.use(cors());
app.listen(PORT, (resp, req) => {
    console.log("the server is start",PORT);
})

app.get('/',(req,resp)=>{
    console.log("you can upload image")
    resp.send("welcome")
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Enable CORS middleware
app.use(cors());

// Route for handling image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  try {

    console.log("the get time")
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const image = req.file;
    const parser = exif.create(image.buffer);
    const result = parser.parse();
    const analysisResult = analyzeMetadata(result);

    res.status(200).json({ analysisResult, metadata: result });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function analyzeMetadata(metadata) {
  


console.log("the metadata", metadata);

  if (!metadata || !metadata.tags) {
    return 'Metadata not found';
  }

  // Check if GPSAltitude is available
  if (metadata.tags.GPSAltitude) {
    const height = metadata.tags.GPSAltitude;
    if (height > 60) {
      return 'Potential violation: Image height exceeds 60 meters';
    }
  } else {
    return 'GPS altitude information not found';
  }
}

