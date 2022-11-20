import base from './base';

export function addPlayer(name:string, peerId:string) {
  return new Promise((resolve, reject) => {
    if (!name || !peerId) reject("Invalid name or peerId");

    base('Players').create([
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

export function getPlayer(peerId:string) {
  return new Promise((resolve, reject) => {
    base('Players').select({
      maxRecords: 1,
      view: 'Grid view',
      filterByFormula: `{Peer ID} = "${peerId}"`
    }).firstPage(async (err:Error, records:any) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}

export function joinGame(peerId:string) {
  return new Promise((resolve, reject) => {
    base('Round 1').create([
      {
        fields: {
          "Peer ID": peerId,
        },
      }
    ], (err:Error, records:any) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}

export function getUnpairedPlayers(peerId:string) {
  return new Promise((resolve, reject) => {
    base('Round 1').select({
      maxRecords: 1,
      view: 'Grid view',
      filterByFormula: `AND({Peer ID} != "${peerId}", {Paired} = "")`
    }).firstPage(async (err:Error, records:any) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}

export function pairPlayers(peerId1:string, peerId2:string) {
  return new Promise((resolve, reject) => {
    base('Round 1').update([
      {
        id: peerId1,
        fields: {
          "Pair": [peerId2],
        },
      },
      {
        id: peerId2,
        fields: {
          "Pair": [peerId1],
        },
      }
    ], (err:Error, records:any) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records);
    });
  });
}

export function handleFailedPairing(badPeerId:string, goodPeerId:string) {
  return new Promise(async (resolve, reject) => {
    await base('Round 1').destroy(badPeerId, (err:Error) => {
      if (err) { console.error(err); return reject(err); }
    });

    await base('Round 1').update([
      {
        id: goodPeerId,
        fields: {
          "Pair": [],
        },
      },
    ], (err:Error, records:any) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records);
    });
  });
}