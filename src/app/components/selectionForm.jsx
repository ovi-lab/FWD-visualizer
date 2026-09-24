"use client";
import { useState, useEffect } from "react";
import { useSocketData } from "@/app/contexts/socketDataContext";
import {loadAll as yamlLoadAll, dump as yamlDump} from "js-yaml"

// Function to parse and process all YAML documents
function yamlParse(yamlData, processDoc) {
  const docs = yamlLoadAll(yamlData);
  const processedDocs = docs.map(doc => processDoc ? processDoc(doc) : doc);
  return yamlDump(processedDocs);
}

export function SelectionForm() {
  const { socket } = useSocketData();
  const [file, setFile] = useState(null);
  const [isConnected, setConnected] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [status, setStatus] = useState([]);

  const handleUploadSubmit = () => {
    if (file === null || isUploading) return;
    setUploading(true);
    setStatus(["Uploading..."]);

    // Raw transcripts are processed on the server, which reports each step here.
    const onProgress = (msg) => setStatus((prev) => [...prev, msg]);
    const finish = () => {
      socket.off("upload-progress", onProgress);
      socket.off("upload-success", onSuccess);
      socket.off("upload-error", onError);
      setUploading(false);
    };
    const onSuccess = () => {
      finish();
      setStatus((prev) => [...prev, "Done."]);
      socket.emit("transcript_request");
      socket.emit("diagram_request");
    };
    const onError = (msg) => {
      finish();
      setStatus([]);
      alert(`Upload failed: ${msg}`);
    };

    socket.on("upload-progress", onProgress);
    socket.once("upload-success", onSuccess);
    socket.once("upload-error", onError);
    socket.emit("upload_file", file, file.name);
  };

  const handleDownloadClick = (filetype) => {
    if (filetype === "j") {
      // Request JSON file from the server
      socket.emit("json_download_request");

      // Listen for response containing JSON data
      socket.once("json_download_response", (response) => {
        // Create a Blob from the JSON data
        const jsonData = response[0];
        const fileName = response[1];
        const blob = new Blob([JSON.stringify(jsonData)], {
          type: "application/json",
        });
        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a link element and trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Clean up by removing the temporary URL and link element
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    }
    if (filetype === "y") {
      // Request YAML file from the server
      socket.emit("yaml_download_request");

      // Listen for response containing YAML data
      socket.once("yaml_download_response", (response) => {
        // Create a Blob from the YAML data
        const yamlData = response[0];
        const fileName = response[1];
        const blob = new Blob([yamlParse(yamlData, (doc) => doc)], {
          type: "application/x-yaml",
        });
        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a link element and trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Clean up by removing the temporary URL and link element
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    }
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
      <div className="shadow-md rounded p-2">
        <div className="mb-3">
          <label
            className="block mb-2 text-sm font-medium text-white"
            htmlFor="upload_button"
          >
            Upload a transcript to visualize (raw Haru JSON or processed JSON)
          </label>
          <input
            className="block w-full mb-2 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="upload_button"
            // No accept filter: many transcripts are saved without a .json extension.
            // The server checks the contents instead.
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className="select-none cursor-pointer rounded-lg border-2 border-gray-700
                     py-1 px-2 font-bold text-gray-700 bg-white text-sm disabled:opacity-50 disabled:cursor-wait"
            type="button"
            onClick={handleUploadSubmit}
            disabled={isUploading}
          >
            {isUploading ? "Processing..." : "Submit"}
          </button>
          {status.map((line, i) => (
            <p
              key={i}
              className={`mt-1 text-xs ${line.startsWith("Warning") ? "text-yellow-300" : "text-gray-300"}`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
      {/* Hidden for now; uncomment to bring back the live feed toggle and downloads.
      <div className="mb-3">
        <label className="inline-flex  items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isConnected}
            className="sr-only peer"
            onChange={toggleConnection}
          />
          <div className="relative w-11 h-6  rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-800 bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-300">
            Receive the live feed
          </span>
        </label>
      </div>
      <button
        className="flex select-none cursor-pointer rounded-lg border-2 border-gray-700
                     py-1 px-2 font-bold text-gray-700 bg-white text-sm"
        onClick={() => handleDownloadClick("j")}
      >
        Download JSON
      </button>
      <button
        className="flex select-none cursor-pointer rounded-lg border-2 border-gray-700
                     py-1 px-2 font-bold text-gray-700 bg-white text-sm"
        onClick={() => handleDownloadClick("y")}
      >
        Download YAML
      </button>
      */}
    </div>
  );
}
