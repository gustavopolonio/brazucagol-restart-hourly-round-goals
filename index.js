// Link server on: https://vercel.com/gustavopolonio/brazucagol-restart-hourly-round-goals

import cors from 'cors'
import express from 'express'
// import { fauna } from './services/faunadb.js'
import all from 'faunadb'
const { query: q } = all
import dotenv from 'dotenv'
import cron from 'node-cron'

const { Client } = all

dotenv.config()

const fauna = new Client({
  secret: process.env.FAUNA_SECRET_KEY
})

const server = express()
server.use(cors())

const port = process.env.PORT || 3002

// async function restartGoals(restartType) {
//   try {
//     const response = await fauna.query(
//       q.Map(
//         q.Paginate(
//           q.Documents(
//             q.Collection("individualGoals")
//           ),
//           { size: 100000 }
//         ),
//         q.Lambda(
//           "x",
//           q.Update(
//             q.Var("x"),
//             {
//               data: { [restartType]: 0 }
//             }
//           )
//         )
//       )
//     )

//     return response
//   } catch(err) {
//     console.log(err)
//   }
// }

// const timer = setInterval(async () => {
//   const date = new Date()
//   const dateInBraziliaTimeZone = date.toLocaleString("pt-BR", {
//     timeZone: "America/Sao_Paulo",
//     hour: "numeric",
//     minute: "numeric",
//     second: "numeric"
//   })

//   const [hours, minutes, seconds] = dateInBraziliaTimeZone.split(":")

//   if (minutes === '00' && seconds === '00') { // Restart hourly Goals
//     await restartGoals('avatarHourlyGoals')
//   }

//   const currentDateInSeconds = (Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(seconds)
  
//   // Round starts at 20:00:00 (Brasilia)
//   const roundStartInSeconds = 20 * 60 * 60

//   if (currentDateInSeconds === roundStartInSeconds) { // Restart round Goals
//     await restartGoals('avatarRoundGoals')
//   }

//   return () => clearTimeout(timer)
// }, 1000)


// cron.schedule("* * * * *", async () => {
//   console.log("A cada 1 minuto--")
//   console.log("A cada 1 minuto--")

//   try {
//     const response = await fauna.query(
//       q.Map(
//         q.Paginate(
//           q.Documents(
//             q.Collection("individualGoals")
//           ),
//           { size: 100000 }
//         ),
//         q.Lambda(
//           "x",
//           q.Update(
//             q.Var("x"),
//             {
//               data: { ['avatarHourlyGoals']: 0 }
//             }
//           )
//         )
//       )
//     )

//     return response
//   } catch(err) {
//     console.log(err)
//   }
// })  

server.get('/', async (req, res) => {
  console.log('fauna')
  console.log(fauna)
  console.log('port')
  console.log(port)

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
              data: { ['avatarHourlyGoals']: 0 }
            }
          )
        )
      )
    )

    return res.json({ message: response })
  } catch(err) {
    console.log(err)
    return res.json({ message: err })
  }
})

server.listen(port, () => {
  console.log("Server initialized")
})