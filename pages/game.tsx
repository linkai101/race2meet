import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";

import {
	joinGame,
	getUnpairedPlayers,
	pairPlayers,
	handleFailedPairing,
	getPlayer,
} from "../lib/airtable";

export default function Game({
	myVideo,
	theirVideo,
	peer,
	peerid,
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
	//const [stream, setStream] = useState<MediaStream>();
	const canvas = useRef<HTMLCanvasElement>(null);
	const [user, setUser] = useState<any>();
	const [otherUser, setOtherUser] = useState<any>();

	// function takepicture() {
	// 	let width = 1920;
	// 	let height = 1080;
	// 	if (canvas.current) {
	// 		canvas.current.width =
	// 			stream?.getVideoTracks()[0].getSettings().width || 1920;
	// 		canvas.current.height =
	// 			stream?.getVideoTracks()[0].getSettings().height || 1080;
	// 		let context = canvas.current.getContext("2d");
	// 		console.log(context);
	// 		if (myVideo.current && context) {
	// 			context?.drawImage(myVideo.current, 0, 0, width, height);
	// 			const data = canvas.current.toDataURL("image/png");
	// 			console.log(data);
	// 		}
	// 	}
	// }

	const call = (peerid: string): boolean => {
		console.log("Calling", peerid);
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then((stream: MediaStream) => {
				try {
					let call = peer.call(peerid, stream);
					call.on("stream", (remoteStream: MediaStream) => {
						if (theirVideo.current) {
							theirVideo.current.srcObject = remoteStream;
						}
					});
					return true;
				} catch {
					return false;
				}
			});
		return false;
	};

	useEffect(() => {
		if (peerid && peer) {
			import("peerjs").then(async ({ default: Peer }) => {
				let navigator = window.navigator as any;
				navigator.mediaDevices
					.getUserMedia({ video: true, audio: false })
					.then((stream: MediaStream) => {
						if (myVideo.current) {
							myVideo.current.srcObject = stream;
						}
						getPlayer(peerid).then((player) => {
							setUser(player);
						});
						joinGame(peerid).then(() => {
							getUnpairedPlayers(peerid).then((players: any) => {
								console.log("players", players);
								players.filter(
									(player: any) => player.fields.Peer[0] !== peerid
								);
								console.log(players);
								if (players.length > 0) {
									let success = !!call(players[0].fields.Peer[0]);
									if (success) {
										pairPlayers(peerid, players[0].fields.Peer[0]);
									} else {
										handleFailedPairing(peerid, players[0].fields.Peer[0]);
									}
									setOtherUser(players[0]);
								}
							});
						});
					});
			});
		}
	}, [peerid, peer]);

	return (
		<div className="bg-black">
			<div className="container max-w-6xl h-screen">
				<video ref={theirVideo} autoPlay className="h-full self-cover" />
				<p className="absolute bottom-0 bg-black p-1 text-xs text-white text-center font-bold">
					{otherUser?.fields.Name}
				</p>
				<div className="fixed bottom-8 right-8">
					<video ref={myVideo} autoPlay className=" w-52 md:w-72 rounded-xl" />
					<p className="absolute bottom-0 bg-black p-1 text-xs text-white text-center font-bold">
						{user?.fields.Name}
					</p>
					<button className="absolute bottom-1 right-1 bg-white w-8 h-8 rounded-full border-2 border-black"></button>
				</div>
			</div>
		</div>
	);
}
