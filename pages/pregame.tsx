import React from 'react';
import Head from "next/head";

import { getGameSettings, getUser } from "../lib/airtable";

export default function PregamePage() {
  const [name, setName] = React.useState<any>(null);
  const [gameSettings, setGameSettings] = React.useState<any>(null);

  React.useEffect(() => {
    getUser("test").then((user:any) => setName(user.fields.Name));
  }, []);

  return <>
    <Head>
      <title></title>
    </Head>

    <div className="container max-w-xl h-screen flex flex-col">
      <div className="px-8 py-16">
        <p className="font-thin">
          hello, <span className="px-1.5 py-0.5 rounded-md bg-neutral-200 font-semibold">{name}</span>
        </p>

        <h2 className="text-xl font-bold mt-6">
          instructions:
        </h2>
        <p className="font-thin">
          you will be randomly connected to another player in your vicinity through a video call. find them and snap a selfie. ASAP. there will be 3 rounds. have fun!
        </p>


      </div>
    </div>
  </>;
}
