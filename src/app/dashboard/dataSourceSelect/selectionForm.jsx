"use client";
import { useDataSource } from "@/app/contexts/dataSourceContext";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

export function SelectionForm({ selected }) {
  const isStatic = selected === "static" || !selected;
  const [file, setFile] = useState(null);
  const [sourceURL, setSourceURL] = useState("");
  const { dataSource, setDataSource } = useDataSource();

  useEffect(() => {
    setDataSource(selected)
  }, [selected])
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      selection: dataSource,
      data: sourceURL,
    });

    try {
      const response = await fetch(`https://${sourceURL}?${params.toString()}`);
      if (response.ok) {
      } else {
        console.error("Failed to connect to dynamic data source");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label className=" flex flex-column font-bold" htmlFor="serverAddress">
          Input the server address
        </label>
        <input
          className="flex flex-column "
          type="text"
          id="serverAddress"
          placeholder={sourceURL}
          value={sourceURL}
          onChange={(e) => setSourceURL(e.target.value)}
        />
      </div>
      {isStatic === true ? (
        <div className="mb-3">
          <label className="flex flex-column font-bold" htmlFor="fileUpload">
            Upload the file you want to see on the dashboard (JSON or YAML
            accepted)
          </label>
          <input
            id="fileUpload"
            className="flex flex-column "
            accept=".json,.yml,.yaml"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
      ) : null}
      <div className="mb-3">
        <button
          className='select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
   py-1 px-2 font-bold text-gray-700 bg-white text-sm"
   '
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
