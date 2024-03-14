"use client";
import { useDataSource } from "@/app/contexts/dataSourceContext";
import { useState } from "react";

function StaticForm() {
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("selection", "static");

    try {
      const response = await fetch("https://your-api-url", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setSelectedDataSource("staticFetch");
        router.push("/dashboard/chat");
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

function DynamicForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      selection: "dynamic",
      data: inputValue,
    });

    try {
      const response = await fetch(`https://your-api-url?${params.toString()}`);
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
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export function SelectionForm({ selected }) {
  const isStatic = selected === "static" || !selected;
  const [file, setFile] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      selection: "dynamic",
      data: inputValue,
    });

    try {
      const response = await fetch(`https://your-api-url?${params.toString()}`);
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
      <input
        type="text"
        id="serverAddress"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <label htmlFor="serverAddress">
        Input the server address
      </label>
      {isStatic === true ? <input type="file" onChange={handleFileChange} /> : null}
      <button type="submit">Submit</button>
    </form>
  );
}
