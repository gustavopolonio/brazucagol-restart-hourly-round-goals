// Link server on: https://dashboard.render.com/

import express from 'express'
import { fauna } from './services/faunadb.js'
import all from 'faunadb'
const { query: q } = all
import dotenv from 'dotenv'

dotenv.config()

const server = express()

const port = process.env.PORT || 3002


async function restartGoals(restartType) {
  try {
    const response = await fauna.query(
      q.Map(
        q.Paginate(
          q.Documents(
            q.Collection("individualGoals")
          ),
          { size: 100000 }
        ),
        q.Lambda(
          "x",
          q.Update(
            q.Var("x"),
            {
              data: { [restartType]: 0 }
            }
          )
        )
      )
    )

    return response
  } catch(err) {
    console.log(err)
  }
}

const timer = setInterval(async () => {
  const date = new Date()
  const dateInBraziliaTimeZone = date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  })

  const [hours, minutes, seconds] = dateInBraziliaTimeZone.split(":")

  console.log(minutes)
  if (minutes === '00') { // Restart hourly Goals
    await restartGoals('avatarHourlyGoals')
  }

  const currentDateInSeconds = (Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(seconds)
  
  // Round starts at 20:00:00 (Brasilia)
  const roundStartInSeconds = 20 * 60 * 60

  if (currentDateInSeconds === roundStartInSeconds) { // Restart round Goals
    await restartGoals('avatarRoundGoals')
  }

  return () => clearTimeout(timer)
}, 1000)

server.listen(port, () => {
  console.log("Server initialized")
})