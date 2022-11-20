import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Peer from "peerjs";

export default function Home() {
	const [peer, setPeer] = useState<Peer>();
	const [loading, setLoading] = useState<string>("Generating Peer ID ...");
	const [stream, setStream] = useState<MediaStream>();

	const myVideo = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		import("peerjs").then(async ({ default: Peer }) => {
			const peer = await new Peer();

			peer.on("open", function (id) {
				console.log("My peer ID is: " + id);
				setLoading("");
			});

			let navigator = window.navigator as any;

			var getUserMedia = navigator.mediaDevices.getUserMedia;

			getUserMedia({ video: true }).then((stream: MediaStream) => {
				setStream(stream);
				if (myVideo.current) {
					myVideo.current.srcObject = stream;
				}
			});
			peer.on("call", function (call) {
				console.log("Getting a call...");
				getUserMedia({ video: true }).then((stream: MediaStream) => {
					call.answer(stream);
					call.on("stream", function (remoteStream) {
						// Show stream in some video/canvas element.
					});
				});
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

			<div>
				<video className="rounded-lg w-96" autoPlay ref={myVideo}></video>
			</div>
		</>
	);
}
