import React, { useEffect, useState } from "react";
import Head from "next/head";
import Peer from "peerjs";

export default function Home() {
	const [peer, setPeer] = useState<Peer>();
	const [loading, setLoading] = useState<string>("Generating Peer ID ...");

	useEffect(() => {
		import("peerjs").then(async ({ default: Peer }) => {
			const peer = await new Peer();

			peer.on("open", function (id) {
				console.log("My peer ID is: " + id);
				setLoading("");
			});
		});
	}, []);

	return (
		<>
			<Head>
				<title>Code Day 22</title>
				<meta name="description" content="by @linkai101 on github" />
			</Head>

			{loading && <p className="font-bold text-center text-3xl">{loading}</p>}

			{!loading && <div></div>}
		</>
	);
}
