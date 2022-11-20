import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { joinGame } from "../lib/airtable";

export default function HomePage({peerid}: {peerid: string}) {
  const router = useRouter()

  const [name, setName] = React.useState<string>("");

  function onSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    joinGame(name, peerid);
    router.push("/pregame");
  }

  return <>
    <Head>
      <title></title>
    </Head>

    <div className="h-screen flex flex-col justify-center items-center gap-3">
      <form
        className="flex gap-2 max-w-full w-72"
        onSubmit={onSubmit}
      >
        <input
          className="px-2 py-1 w-full flex-1 text-sm border-2 border-gray-300 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button
          className="px-3 py-1 font-bold text-white rounded-lg bg-blue-500"
          type="submit"
        >
          Join
        </button>
      </form>
    </div>
  </>;
}
