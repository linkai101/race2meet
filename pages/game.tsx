import React, { useEffect, useState, useRef } from "react";

export default function Game({
	myVideo,
	theirVideo,
}: {
	myVideo: React.RefObject<HTMLVideoElement>;
	theirVideo: React.RefObject<HTMLVideoElement>;
}) {
	/*
		1. join game (airtable.ts joinGame)
		2. get unpaired players (airtable.ts getUnpairedPlayers)
		3. pair with first unpaired player (airtable.ts pairPlayers)
		4. if it doesn't work, handle (airtable.js handleFailedPairing) and go back to 2, if none are available then wait
	*/

	return (
		<div>
			<video ref={myVideo} autoPlay className="rounded-lg w-96"></video>
			<video ref={theirVideo} autoPlay className="rounded-lg w-96"></video>
		</div>
	);
}
