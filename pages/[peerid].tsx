import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
import { useRouter } from "next/router";

export default function Connect() {
	const router = useRouter();
	const { peerid }: { peerid?: string } = router.query;

	const [peer, setPeer] = useState<Peer>();
	const [loading, setLoading] = useState<string>("Generating Peer ID ...");

	const myVideo = useRef<HTMLVideoElement>(null);
	const theirVideo = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (peerid) {
			import("peerjs").then(async ({ default: Peer }) => {
				const peer = await new Peer();

				peer.on("open", function (id) {
					console.log("My peer ID is: " + id);
					setLoading("");

					let navigator = window.navigator as any;

					var getUserMedia = navigator.mediaDevices.getUserMedia;
					getUserMedia({ video: true, audio: false }).then(
						(stream: MediaStream) => {
							if (myVideo.current) {
								myVideo.current.srcObject = stream;
							}
							let call = peer.call(peerid || "", stream);
							call.on("stream", (remoteStream) => {
								if (theirVideo.current) {
									theirVideo.current.srcObject = remoteStream;
								}
								// Show stream in some video/canvas element.
							});
						}
					);
				});
			});
		}
	}, [router, peerid]);

	return (
		<div>
			<video className="rounded-lg w-96" autoPlay ref={myVideo}></video>
			<video className="rounded-lg w-96" autoPlay ref={theirVideo}></video>
		</div>
	);
}
