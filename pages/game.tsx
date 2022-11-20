import React, { useEffect, useState, useRef } from "react";

export default function Game() {
	const [loading, setLoading] = useState<string>("Generating Peer ID ...");
	const [stream, setStream] = useState<MediaStream>();
	const myVideo = useRef<HTMLVideoElement>(null);
	const theirVideo = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		import("peerjs").then(async ({ default: Peer }) => {
			const peer = await new Peer();

			peer.on("open", function (id) {
				console.log("My peer ID is: " + id);
				setLoading("Awaiting Connection ...");
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
						if (theirVideo.current) {
							theirVideo.current.srcObject = remoteStream;
						}
					});
				});
			});
		});
	}, []);

	return (
		<div>
			<video ref={myVideo} autoPlay className="rounded-lg w-96"></video>
			<video ref={theirVideo} autoPlay className="rounded-lg w-96"></video>
		</div>
	);
}
