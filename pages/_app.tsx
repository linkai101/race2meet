import React, { useEffect, useState, useRef } from "react";
import "../styles/globals.css";
import Peer from "peerjs";

import Head from "next/head";
import { useRouter } from "next/router";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [loading, setLoading] = useState<string>("Generating Peer ID ...");
	const [stream, setStream] = useState<MediaStream>();
	const [peerid, setPeerId] = useState<string>("");
	const [peer, setPeer] = useState<Peer>();

	const myVideo = useRef<HTMLVideoElement>(null);
	const theirVideo = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		let peerid = localStorage.getItem("peerid");
		setPeerId(peerid || "");

		import("peerjs").then(async ({ default: Peer }) => {
			const peer = peerid ? await new Peer(peerid) : await new Peer();
			setPeer(peer);

			peer.on("open", function (id) {
				console.log("My peer ID is: " + id);
				setLoading("Awaiting Connection ...");
				setPeerId(id);
				localStorage.setItem("peerid", id);
			});

			peer.on("call", function (call) {
				console.log("Getting a call...");
				console.log(router.pathname);

				let navigator = window.navigator as any;
				var getUserMedia = navigator.mediaDevices.getUserMedia;

				getUserMedia({ video: true }).then((stream: MediaStream) => {
					setStream(stream);
					if (myVideo.current) {
						myVideo.current.srcObject = stream;
					}
				});
				getUserMedia({ video: true }).then((stream: MediaStream) => {
					call.answer(stream);
					call.on("stream", function (remoteStream) {
						if (theirVideo.current) {
							theirVideo.current.srcObject = remoteStream;
						}
					});
				});
			});
		});
	}, []);

	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Component
				{...pageProps}
				myVideo={myVideo}
				theirVideo={theirVideo}
				peerid={peerid}
				peer={peer}
			/>
		</>
	);
}

export default MyApp;
