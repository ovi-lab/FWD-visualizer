"use client";
import { useDataSource } from "@/app/contexts/dataSourceContext";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export function SelectionForm({ selected }) {
  const isStatic = selected === "static" || !selected;
  const [file, setFile] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { dataSource, setDataSource } = useDataSource();

  const socket = io(":6400", {
    cors: { origin: "http://127.0.0.1:6400", methods: ["GET", "POST"] },
  });

  useEffect(() => {
    setDataSource(selected);
  }, [selected, setDataSource]);

  const handleUploadSubmit = (e) => {
    if (file !== null) {
      socket.emit("upload_file", file, file.name);
      socket.on("returner", (newfile) => {
        console.log("file", newfile);
      });
    }
    const params = {
      selection: dataSource,
      data: sourceURL,
    };

    return () => {
      socket.disconnect();
    };
  };

  const toggleConnection = () => {
    if (isConnected) {
      socket.emit("killRosFeed");
      setIsConnected(false);
    } else {
      socket.emit("initRosFeed");
      setIsConnected(true);
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
      <button onClick={toggleConnection}>
        {isConnected
          ? "Stop Receiving from the ROS Subscriber"
          : "Begin Receiving from the ROS Subscriber"}
      </button>
    </div>
  );
}
