import React, { useEffect, useState } from "react";
import Peer from "peerjs";
import { Stream } from "stream";

export default function testconnect() {
	const [peer, setPeer] = useState<Peer>();
	const [loading, setLoading] = useState<string>("Generating Peer ID ...");

	useEffect(() => {
		import("peerjs").then(async ({ default: Peer }) => {
			const peer = await new Peer();

			peer.on("open", function (id) {
				console.log("My peer ID is: " + id);
				setLoading("");
			});

			var getUserMedia =
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;
			getUserMedia(
				{ video: true, audio: true },
				function (stream: MediaStream) {
					var call = peer.call("another-peers-id", stream);
					call.on("stream", function (remoteStream) {
						// Show stream in some video/canvas element.
					});
				},
				function (err: Error) {
					console.log("Failed to get local stream", err);
				}
			);
		});
	}, []);

	return <div>testconnect</div>;
}
