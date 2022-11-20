import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { getGameSettings, getPlayer } from "../lib/airtable";

export default function PregamePage({ peerid }: { peerid: string }) {
	const router = useRouter();

	const [name, setName] = React.useState<any>(null);
	const [gameSettings, setGameSettings] = React.useState<any>(null);

	React.useEffect(() => {
		if (peerid) {
			peerid &&
				getPlayer(peerid).then((player: any) => {
					console.log(peerid);
					if (!player) {
						return;
					}
					setName(player.fields.Name);
				});
			fetchGameSettings();
		}
	}, [peerid]);

	function fetchGameSettings() {
		getGameSettings().then((settings: any) => setGameSettings(settings.fields));
	}

	return (
		<>
			<Head>
				<title></title>
			</Head>

			<div className="container max-w-xl h-screen flex flex-col">
				<div className="px-8 py-16">
					<p className="font-thin">
						hello,{" "}
						<span className="px-1.5 py-0.5 rounded-md bg-neutral-200 font-semibold">
							{name}
						</span>
					</p>

					<h2 className="text-xl font-bold mt-6">instructions:</h2>
					<p className="font-thin">
						you will be randomly connected to another player in your vicinity
						through a video call. find them and snap a selfie. ASAP. have fun!
					</p>

					<button
						className="px-2 py-1 text-xs text-blue-500 font-bold border-2 border-blue-500 rounded-md mt-4"
						onClick={fetchGameSettings}
					>
						reload
					</button>

					{gameSettings && (
						<>
							{new Date() >= new Date(gameSettings["Round 1 Start"]) ? (
								<>
									<div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg mt-6">
										<p className="text-sm">
											The game has begun. Click below to start.
										</p>
										<Link href="/game">
											<button
												className="px-2.5 py-1 text-sm text-white font-bold bg-green-500 rounded-md mt-2.5"
												onClick={fetchGameSettings}
											>
												start
											</button>
										</Link>
									</div>
								</>
							) : (
								<>
									<div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg mt-6">
										<p className="text-sm">
											Game starts at{" "}
											<span className="font-bold">
												{new Date(
													gameSettings["Round 1 Start"]
												).toLocaleDateString("en-US", {
													hour: "numeric",
													minute: "numeric",
													hour12: true,
												})}
											</span>
											. Reload this page to check for updates.
										</p>
									</div>
								</>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}
