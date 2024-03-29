"use client";
import { useState, useEffect } from "react";
import { useWebSocket } from "@/app/contexts/webSocketContext";
import UploadArea from "./uploadArea";

export function SelectionForm() {
  const socket = useWebSocket();
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

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.emit("killRosFeed");
  // }, [socket]);

  const toggleConnection = () => {
    if (isConnected) {
      socket.emit("killRosFeed");
      setConnected(false);
    } else {
      socket.emit("initRosFeed");
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
            class="block mb-2 text-sm font-medium text-white"
            for="upload_button"
          >
            Upload the file you want to see visualized (YAML and JSON accepted)
          </label>
          <input
            class="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="upload_button"
            accept=".json,.yml,.yaml"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="mb-3">
            <button
              className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
                     py-1 px-2 font-bold text-gray-700 bg-white text-sm"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <div className="mb-3">

        <label class="inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={isConnected} class="sr-only peer" onChange={toggleConnection}/>
          <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Connect to the live feed
          </span>
        </label>          
      </div>
    </div>
  );
}
