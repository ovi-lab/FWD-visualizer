"use client";
import { useState, useRef} from "react";
import { useWebSocket } from "../../contexts/webSocketContext";

export function SelectionForm({ selected }) {
  const socket = useWebSocket()
  const isStatic = selected === "static" || !selected;
  const [file, setFile] = useState(null);
  let connectedRef = useRef(false);
  const [ isConnected, setConnected ] = useState(connectedRef)


  const handleUploadSubmit = (e) => {
    if (file !== null) {
      socket.emit("upload_file", file, file.name);
      socket.on("returner", (newfile) => {
        console.log("file", newfile);
      });
    }
  };

  const toggleConnection = () => {
    if (isConnected) {
      socket.emit("killRosFeed");
      connectedRef = false;
      setConnected(false)
    } else {
      socket.emit("initRosFeed");
      setConnected(true)
      connectedRef = true;
    }
  };


  return isStatic === true ? (
    <form
      onSubmit={handleUploadSubmit}
      method="post"
      encType="multipart/form-data"
    >
      <div className="mb-3">
        <label className="flex flex-column font-bold" htmlFor="fileUpload">
          Upload the transcript file you want to see on the dashboard (YAML
          accepted)
        </label>
        <input
          id="fileUpload"
          className="flex flex-column "
          accept=".yml,.json"
          type="file"
          name="file"
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
  ) : (
    <div className="mb-3">
      <button onClick={toggleConnection}
      className={`px-4 py-2 rounded-lg ${
          isConnected ? 'bg-red-500' : 'bg-green-500'
        } text-white`}
      >
        {isConnected
          ? "Stop Receiving from the ROS Subscriber"
          : "Begin Receiving from the ROS Subscriber"}
      </button>
    </div>
  );
}
