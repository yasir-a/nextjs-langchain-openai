"use client";
import { useState } from "react";
import Image from "next/image";
import logo from "../assets/logo.png";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [streamedData, setStreamedData] = useState("");

  const handleOnChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("api/chatMod", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const text = new TextDecoder().decode(value);
      setStreamedData((prevData) => prevData + text);
    }
  };

  const handleOnClearChat = () => {
    setStreamedData("");
  };

  return (
    <main className='flex max-w-6xl mx-auto item-center justify-center p-24'>
      <div className='flex flex-col gap-4 '>
        <h1 className='text-gray-200 font-extrabold text-6xl text-center'>
          DevBotPlus GPT
        </h1>
        <div className='flex justify-center'>
          <Image
            src={logo}
            width={250}
            height={250}
            alt='App logo'
            className='text-center'
          />
        </div>

        <form onSubmit={handleOnSubmit}>
          <input
            className='py-2 px-4 rounded-md bg-gray-600 w-full text-white'
            type='text'
            placeholder='Enter Prompt'
            name='prompt'
            value={prompt}
            onChange={handleOnChange}
            required
          />
          <div className='flex gap-4 py-4 justify-end'>
            <button
              type='submit'
              className='py-2 px-4 rounded-md text-sm text-white hover:opacity-80 transition-opacity bg-yellow-500'
            >
              Submit
            </button>
            <button
              type='button'
              className='py-2 px-4 rounded-md text-sm bg-gray-700 text-white hover:opacity-80 transition-opacity'
              onClick={handleOnClearChat}
            >
              Clear
            </button>
          </div>
        </form>

        {streamedData && (
          <div>
            <h1 className='text-2xl text-gray-400'>User:</h1>
            <p className='text-gray-200 rounded-md bg-gray-700 p-4'>{prompt}</p>
            <h1 className='text-2xl text-gray-400'>DevBotPlus GPT:</h1>
            <p className='text-gray-200 rounded-md bg-gray-700 p-4'>
              {streamedData}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
