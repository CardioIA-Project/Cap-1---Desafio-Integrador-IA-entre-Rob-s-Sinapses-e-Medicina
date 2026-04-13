import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000
const appointmentsPath = path.resolve(process.cwd(), 'src/data/appointments.json')
const dashboardPath = path.resolve(process.cwd(), 'src/data/dashboard.json')

app.use(cors())
app.use(express.json())

app.get('/appointments', (req, res) => {
  fs.readFile(appointmentsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler os dados' })
    }

    try {
      const appointments = JSON.parse(data)
      res.json(appointments)
    } catch (parseErr) {
      res.status(500).json({ error: 'Erro ao analisar o JSON' })
    }
  })
})

app.get('/dashboard', (req, res) => {
  fs.readFile(dashboardPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler os dados do dashboard' })
    }

    try {
      const dashboard = JSON.parse(data)
      res.json(dashboard)
    } catch (parseErr) {
      res.status(500).json({ error: 'Erro ao analisar o JSON do dashboard' })
    }
  })
})

app.post('/appointments', (req, res) => {
  fs.readFile(appointmentsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      return res.status(500).json({ error: 'Erro ao ler os dados' })
    }

    try {
      const appointments = JSON.parse(data)
      const nextId = appointments.length > 0 ? Math.max(...appointments.map((item) => item.id)) + 1 : 1
      const newAppointment = {
        id: nextId,
        patient: req.body.patient,
        type: req.body.type,
        date: req.body.date,
        time: req.body.time,
      }

      const updatedAppointments = [newAppointment, ...appointments]

      fs.writeFile(appointmentsPath, JSON.stringify(updatedAppointments, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Erro ao salvar o agendamento' })
        }

        res.status(201).json(newAppointment)
      })
    } catch (parseErr) {
      res.status(500).json({ error: 'Erro ao analisar o JSON' })
    }
  })
})

app.listen(PORT, () => {
  console.log(`Appointment server running on http://localhost:${PORT}`)
})
