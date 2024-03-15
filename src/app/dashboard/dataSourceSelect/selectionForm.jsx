"use client";
import { useDataSource } from "@/app/contexts/dataSourceContext";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export function SelectionForm({ selected }) {
  const isStatic = selected === "static" || !selected;
  const [file, setFile] = useState(null);
  const [sourceURL, setSourceURL] = useState("");
  const [subscriberAddress, setSubscriberAddress] = useState("");
  const { dataSource, setDataSource } = useDataSource();

  const socket = io(":6400", {
    cors: { origin: "http://127.0.0.1:6400", methods: ["GET", "POST"] },
  });

  useEffect(() => {
    setDataSource(selected);
  }, [selected, setDataSource]);

  const handleSubmit = (e) => {
    if (file !== null) {
       socket.emit("uploadFile", file);
       socket.on("returner", (newfile) => {console.log("file", newfile)});
      
    }
    const params = {
      selection: dataSource,
      data: sourceURL,
    };

    return () => {
      socket.disconnect();
    };
  };

  return (
    <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
      <div className="mb-5">
        <label className=" flex flex-column font-bold" htmlFor="serverAddress">
          Input the server address
        </label>
        <input
          className="flex flex-column "
          type="text"
          id="subscriberAddress"
          placeholder={sourceURL}
          value={sourceURL}
          onChange={(e) => setSourceURL(e.target.value)}
        />
      </div>
      {isStatic === true ? (
        <div className="mb-3">
          <label className="flex flex-column font-bold" htmlFor="fileUpload">
            Upload the transcript file you want to see on the dashboard (YAML
            accepted)
          </label>
          <input
            id="fileUpload"
            className="flex flex-column "
            accept=".yml,.yaml"
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="mb-3">
          <label
            className=" flex flex-column font-bold"
            htmlFor="serverAddress"
          >
            Input the ROS Node Address
          </label>
          <input
            className="flex flex-column "
            type="text"
            id="serverAddress"
            placeholder={subscriberAddress}
            value={subscriberAddress}
            onChange={(e) => setSubscriberAddress(e.target.value)}
          />
        </div>
      )}
      <div className="mb-3">
        <button
          className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
                     py-1 px-2 font-bold text-gray-700 bg-white text-sm"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
