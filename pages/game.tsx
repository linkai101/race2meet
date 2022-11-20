import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";

export default function Game({
	myVideo,
	theirVideo,
	peer,
}: {
	myVideo: React.RefObject<HTMLVideoElement>;
	theirVideo: React.RefObject<HTMLVideoElement>;
	peer: Peer;
}) {
	/*
		1. join game (airtable.ts joinGame)
		2. get unpaired players (airtable.ts getUnpairedPlayers)
		3. pair with first unpaired player (airtable.ts pairPlayers)
		4. if it doesn't work, handle (airtable.js handleFailedPairing) and go back to 2, if none are available then wait
	*/
	const [stream, setStream] = useState<MediaStream>();

	const call = (peerid: string) => {
		if (stream) {
			let call = peer.call(peerid, stream);
			call.on("stream", (remoteStream: MediaStream) => {
				if (theirVideo.current) {
					theirVideo.current.srcObject = remoteStream;
				}
			});
		}
	};

	useEffect(() => {
		import("peerjs").then(async ({ default: Peer }) => {
			let navigator = window.navigator as any;
			var getUserMedia = navigator.mediaDevices.getUserMedia;

			getUserMedia({ video: true }).then((stream: MediaStream) => {
				if (myVideo.current) {
					setStream(stream);
					myVideo.current.srcObject = stream;
				}
			});
		});
	}, []);

	return (
		<div className="bg-black">
			<div className="container max-w-6xl h-screen">
				<video ref={theirVideo} autoPlay className="h-full self-cover" />
				<video
					ref={myVideo}
					autoPlay
					className="fixed bottom-8 right-8 w-52 md:w-72 rounded-xl"
				/>
			</div>
		</div>
	);
}
