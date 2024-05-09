"use client";
import { useState, useEffect } from "react";
import { useSocketData } from "@/app/contexts/SocketDataContext";

export function SelectionForm() {
  const {socket} = useSocketData();
  const [file, setFile] = useState(null);
  const [isConnected, setConnected] = useState(false);

  const handleUploadSubmit = (e) => {
    if (file !== null) {
      socket.emit("upload_file", file, file.name);
      socket.once("returner", (newfile) => {
        console.log("file", newfile);
      });
    }
  };

  const handleDownloadClick = () => {
    // Request JSON file from the server
    socket.emit("request_download");

    // Listen for response containing JSON data
    socket.once("json_file_response", (response) => {
      // Create a Blob from the JSON data
      const jsonData = response[0]
      const fileName = response[1]
      const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a link element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up by removing the temporary URL and link element
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  };


  const toggleConnection = () => {
    if (isConnected) {
      socket.emit("kill_ros_feed");
      setConnected(false);
    } else {
      socket.emit("init_ros_feed");
      setConnected(true);
    }
  };

  return (
    <div className="items-center justify-center mb-8">
      <form
        onSubmit={handleUploadSubmit}
        method="post"
        encType="multipart/form-data"
        className="shadow-md rounded p-2"
      >
        <div className="mb-3">
          <label
            className="block mb-2 text-sm font-medium text-white"
            htmlFor="upload_button"
          >
            Upload the file you want to see visualized (YAML and JSON accepted)
          </label>
          <input
            className="block w-full mb-2 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="upload_button"
            accept=".json,.yml,.yaml"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
            <button
              className="select-none cursor-pointer rounded-lg border-2 border-gray-700
                     py-1 px-2 font-bold text-gray-700 bg-white text-sm"
              type="submit"
            >
              Submit
            </button>
        </div>
      </form>
      <div className="mb-3">
        <label className="inline-flex  items-center cursor-pointer">
          <input type="checkbox" checked={isConnected} className="sr-only peer" onChange={toggleConnection}/>
          <div className="relative w-11 h-6  rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-300">
          Receive the live feed
          </span>
        </label>          
      </div>
      <button className="flex select-none cursor-pointer rounded-lg border-2 border-gray-700
                     py-1 px-2 font-bold text-gray-700 bg-white text-sm"
                     onClick={handleDownloadClick}>Download JSON</button>
    </div>
  );
}
