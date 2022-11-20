import React, { useEffect, useState, useRef } from "react";

export default function Game({
	myVideo,
	theirVideo,
}: {
	myVideo: React.RefObject<HTMLVideoElement>;
	theirVideo: React.RefObject<HTMLVideoElement>;
}) {
	return (
		<div>
			<video ref={myVideo} autoPlay className="rounded-lg w-96"></video>
			<video ref={theirVideo} autoPlay className="rounded-lg w-96"></video>
		</div>
	);
}
