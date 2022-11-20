import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";

import { joinGame, getUnpairedPlayers, pairPlayers, handleFailedPairing } from "../lib/airtable";

export default function Game({
	myVideo,
	theirVideo,
	peer,
	peerid
}: {
	myVideo: React.RefObject<HTMLVideoElement>;
	theirVideo: React.RefObject<HTMLVideoElement>;
	peer: Peer;
	peerid: string;
}) {
	/*
		1. join game (airtable.ts joinGame)
		2. get unpaired players (airtable.ts getUnpairedPlayers)
		3. pair with first unpaired player (airtable.ts pairPlayers)
		4. if it doesn't work, handle (airtable.js handleFailedPairing) and go back to 2, if none are available then wait
	*/
	const [stream, setStream] = useState<MediaStream>();

	const call = (peerid: string) => {
		console.log("Calling...");
		if (stream) {
			let call = peer.call(peerid, stream);
			if (call) {
				call.on("stream", (remoteStream: MediaStream) => {
					if (theirVideo.current) {
						theirVideo.current.srcObject = remoteStream;
					}
					return true;
				});
			} else {
				return false; // call failed
			}
		}
	};

	useEffect(() => {
		import("peerjs").then(async ({ default: Peer }) => {
			let navigator = window.navigator as any;
			navigator.mediaDevices.getUserMedia({ video: true }).then((stream: MediaStream) => {
				if (myVideo.current) {
					setStream(stream);
					myVideo.current.srcObject = stream;
				}
			});
		});

		joinGame(peerid).then(() => {
			let interval = setInterval(() => {
				getUnpairedPlayers(peerid).then((players:any) => {
					if (players.length > 0) {
						pairPlayers(peerid, players[0].fields["Peer ID"][0]).then(() => {
							const success = true;
							call(players[0].fields.peerid);
							if (success) {
								clearInterval(interval);
							} else {
								handleFailedPairing(players[0].fields["Peer ID"], peerid);
							}
						});
					}
				});
			}, 1000);
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
