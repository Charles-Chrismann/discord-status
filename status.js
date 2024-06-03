import 'dotenv/config'
import { CronJob } from 'cron';
import crypto from 'crypto'
import punchs from './punchs.js'
import { exit } from 'process';

async function updateStatus() {
  const date = new Date()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const res = await ( await fetch(`https://discord.com/api/v9/users/@me/settings`, {
  headers: {
    authorization: process.env.token,
    "content-type": "application/json",
  },
  body: JSON.stringify({
    custom_status: {
      text: `${hours}:${minutes} ${punchs[Math.floor(Math.random() * punchs.length)]}`
    }
  }),
  method: "PATCH",
  })).json()
  console.log(res)
}

const statusUpdateJob = new CronJob(
  '0 * * * * *',
  updateStatus,
  null,
  true
)