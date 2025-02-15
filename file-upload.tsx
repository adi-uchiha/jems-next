import React, { useState, useRef } from 'react';
import { Trash2, FileText } from 'lucide-react';

const PDFUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const simulateUpload = (file) => {
    setIsUploading(true);
    setUploadError(false);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate random upload error (20% chance)
    if (Math.random() < 0.2) {
      setTimeout(() => {
        clearInterval(interval);
        setUploadError(true);
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      simulateUpload(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      simulateUpload(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadError(false);
    setIsUploading(false);
    setUploadComplete(false);
  };

  const handleSubmit = () => {
    // Simulate API call
    console.log('Submitting file:', file);
  };

  const baseClasses = `
    relative w-96 h-40 p-4 rounded-lg border-2 border-dashed
    transition-all duration-200 ease-in-out
    flex flex-col items-center justify-center
    ${isDragging ? 'border-purple-500 bg-purple-50' : 
      uploadError ? 'border-red-500 bg-red-50' :
      'border-gray-300 hover:border-purple-500'}
  `;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={baseClasses}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf"
          className="hidden"
        />

        {!file && (
          <div className="text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-1">
              <span className="text-purple-600 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>
                Click to upload
              </span>
              {" "}or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, SVG, PDF, GIF or JPG (max. 25mb)
            </p>
          </div>
        )}

        {file && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700 truncate">
                  {file.name}
                </span>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {uploadError ? (
              <div className="text-center">
                <p className="text-sm text-red-500 mb-2">
                  Upload failed, please try again
                </p>
                <button
                  onClick={() => simulateUpload(file)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    uploadComplete ? 'bg-green-500' : 'bg-purple-600'
                  }`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!uploadComplete}
        className={`px-4 py-2 rounded-lg transition-all duration-200
          ${uploadComplete
            ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        Submit
      </button>
    </div>
  );
};

export default PDFUpload;