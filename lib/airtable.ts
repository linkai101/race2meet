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

export async function joinGame(peerId:string) {
  const player:any = await getPlayer(peerId);
  return new Promise((resolve, reject) => {
    base('Round 1').create([
      {
        fields: {
          "Peer ID": [player.id],
        },
      }
    ], (err:Error, records:any) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records[0]);
    });
  });
}

export async function getUnpairedPlayers(peerId:string) {
  const player:any = await getPlayer(peerId);
  return new Promise((resolve, reject) => {
    base('Round 1').select({
      maxRecords: 1,
      view: 'Grid view',
      filterByFormula: `AND({Peer ID} != "${peerId}", {Pair} = BLANK())`
    }).firstPage(async (err:Error, records:any) => {
      if (err) { console.error(err); return reject(err); }
      resolve(records);
    });
  });
}

export async function pairPlayers(peerId1:string, peerId2:string) {
  const player1:any = await getPlayer(peerId1);

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
          "Pair": [player1.id],
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