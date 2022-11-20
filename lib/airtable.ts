import base from './base';

export function joinGame(name:string, peerId:string) {
  return new Promise((resolve, reject) => {
    if (!name || !peerId) reject("Invalid name or peerId");

    base('Round 1').create([
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

export function getGameSettings() {
  return new Promise((resolve, reject) => {
    base('Settings').select({
      maxRecords: 1,
      view: 'Grid view',
      filterByFormula: `{Name} = "CodeDay22"`
    }).firstPage(async (err:Error, records:any) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}

export function getUser(peerId:string) {
  return new Promise((resolve, reject) => {
    base('Round 1').select({
      maxRecords: 1,
      view: 'Grid view',
      filterByFormula: `{Peer ID} = "${peerId}"`
    }).firstPage(async (err:Error, records:any) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}