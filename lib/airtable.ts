import base from './base';

export function joinGame(name:string, peerId:string) {
  return new Promise((resolve, reject) => {
    if (!name || !peerId) reject("Invalid name or peerId");

    base('Game').create([
      {
        fields: {
          "Name": name,
          "Peer ID": peerId,
        },
      }
    ], (err:Error, records:any) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}