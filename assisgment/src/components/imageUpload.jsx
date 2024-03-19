import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./imageupload.css";

const ImageUpload = () => {

  const [file, setFile] = useState(null);
  const [metaData, setMetaData] = useState()
  const [result, setResult] = useState()
  const [fileName, setFileName] = useState()
  const inputFileRef = useRef(null); // Ref for the input element

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Please select an image');

      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    console.log("the files", file.name)
    setFileName(file.name)


    axios
      .post('http://localhost:5000/upload', formData)
      .then((res) => {

        setMetaData(res.data.metadata);
        setResult(res.data.analysisResult)
        toast.success('Images uploaded successfully');
        setTimeout(() => {
          setFile(null);

          if (inputFileRef.current) {
            inputFileRef.current.value = ''; // Clearing the value
          }
        }, 6000)


      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to upload");
      });
  };

  console.log("the ", metaData)

  return (
    <div className="container">
      <h1>Image Uploader</h1>
      <div className="upload-section text-center">
        <input type="file" ref={inputFileRef} onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>

      </div>
      <ToastContainer />
      {result ? <>
        <h2>{fileName}</h2>
        <h2>{result}</h2>
      </>
        : ''}
      {metaData && (
        <div>
          <h2>Metadata</h2>
          <ul>
            <li>Start Marker Offset: {metaData.startMarker.offset}</li>
            <li>Image Size: {metaData.imageSize.width}x{metaData.imageSize.height}</li>
            <li>Thumbnail Offset: {metaData.thumbnailOffset}</li>
            <li>Thumbnail Length: {metaData.thumbnailLength}</li>
            {/* Add more metadata fields as needed */}
          </ul>
        </div>
      )}

    </div>
  );
};

export default ImageUpload;
