import { CronJob } from 'cron';
import 'dotenv/config'
import WebSocket from 'ws';

let hbId
let lastSequence = null
function heartbeat(time) {
  if(hbId) clearInterval(hbId)
  console.log('stating heartbeat')
  hbId = setInterval(() => ws.send(JSON.stringify({ op: 1, d: lastSequence })), time)
}

const statusUpdateJob = new CronJob('0 * * * * *',
  () => {
    const date = new Date()
    console.log(`${date.getHours()}:${date.getMinutes()}`)
    ws.send(JSON.stringify({
      op: 3,
      d: {
        activities: [],
        status: `${date.getHours()}:${date.getMinutes()}`,
        afk: false
      }
    }))
  },
  null,
  false
)

const ws = new WebSocket('wss://gateway.discord.gg');
ws.on('error', console.error);
ws.on('close', (data) => console.log('closed', data));
ws.on('open', (data) => {
  // heartbeat()
  ws.send(JSON.stringify({
    op: 2,
    d: {
      token: process.env.token,
      properties: {
        "os": "linux",
        "browser": "disco",
        "device": "disco"
      }
    }
  }))
  ws.on('message', (raw) => {
    data = JSON.parse(raw)
    console.log(data)

    switch (data.op) {
      case 0:
        console.log(data)
        break;
      case 1:
        lastSequence = data.d
        break;
      case 10:
        heartbeat(data.d.heartbeat_interval)
        statusUpdateJob.start()
        break;
    }
  })
})

