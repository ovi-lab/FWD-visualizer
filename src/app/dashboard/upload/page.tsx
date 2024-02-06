'use client'
import { useState } from 'react';

export default function ServerUploadPage() {
  const [file, setFile] = useState<File | null>(null);

  async function uploadFile() {
    try {
      if (!file) {
        throw new Error('No file selected');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/processUpload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  }

  return (
    <main>
      <h1>Upload JSON File</h1>
      <form onSubmit={(e) => { e.preventDefault(); uploadFile(); }}>
        <input type="file" name="file" onChange={handleFileChange} accept=".json" />
        <input type="submit" value="Upload" />
      </form>
    </main>
  );
}