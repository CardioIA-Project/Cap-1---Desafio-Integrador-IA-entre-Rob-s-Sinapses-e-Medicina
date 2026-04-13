import { useEffect, useMemo, useReducer, useState } from 'react'
import styles from '../App.module.css'

const initialForm = {
  patient: '',
  date: '',
  time: '',
  type: 'Consulta de Rotina',
}

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      }
    case 'RESET':
      return initialForm
    default:
      return state
  }
}

function Agendamentos() {
  const [formState, dispatch] = useReducer(formReducer, initialForm)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/appointments')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao carregar agendamentos')
        }
        return res.json()
      })
      .then((data) => setAppointments(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (field) => (event) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field,
      value: event.target.value,
    })
  }

  const upcomingAppointments = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const maxDate = new Date(now)
    maxDate.setDate(maxDate.getDate() + 7)

    return appointments
      .map((appointment) => ({
        ...appointment,
        dateObject: new Date(appointment.date),
      }))
      .filter((appointment) => {
        const date = appointment.dateObject
        if (Number.isNaN(date.getTime())) {
          return false
        }
        date.setHours(0, 0, 0, 0)
        return date >= now && date <= maxDate
      })
      .sort((a, b) => a.dateObject - b.dateObject || a.time.localeCompare(b.time))
  }, [appointments])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formState.patient || !formState.date || !formState.time) {
      return
    }

    const newAppointment = {
      patient: formState.patient,
      type: formState.type,
      date: formState.date,
      time: formState.time,
    }

    try {
      const response = await fetch('http://localhost:3000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar o agendamento')
      }

      const savedAppointment = await response.json()
      setAppointments((current) => [savedAppointment, ...current])
      dispatch({ type: 'RESET' })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className={styles.appointmentsPage}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Agendamentos</h1>
          <p>Use o formulário para agendar uma consulta e veja as próximas visitas abaixo.</p>
        </div>
      </header>

      <div className={styles.scheduleGrid}>
        <section className={`${styles.tableCard} ${styles.appointmentForm}`}>
          <h2>Agendar Consulta</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="patient">Paciente</label>
              <input
                id="patient"
                type="text"
                value={formState.patient}
                onChange={handleChange('patient')}
                placeholder="Nome do paciente"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="date">Data</label>
                <input
                  id="date"
                  type="date"
                  value={formState.date}
                  onChange={handleChange('date')}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="time">Horário</label>
                <input
                  id="time"
                  type="time"
                  value={formState.time}
                  onChange={handleChange('time')}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type">Tipo de Consulta</label>
              <select id="type" value={formState.type} onChange={handleChange('type')}>
                <option>Consulta de Rotina</option>
                <option>Ecocardiograma</option>
                <option>Teste de Esforço</option>
                <option>Consulta de Retorno</option>
              </select>
            </div>

            <button type="submit" className={styles.primaryButton}>
              Confirmar Agendamento
            </button>
          </form>
        </section>

        <section className={`${styles.tableCard} ${styles.appointmentsList}`}>
          <h2>Próximas Consultas</h2>
          {loading ? (
            <p>Carregando agendamentos...</p>
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : upcomingAppointments.length === 0 ? (
            <p>Não há consultas agendadas para os próximos 7 dias.</p>
          ) : (
            <div className={styles.appointmentCards}>
              {upcomingAppointments.map((appointment) => (
                <article key={appointment.id} className={styles.appointmentCard}>
                  <div className={styles.appointmentHeader}>
                    <strong>{appointment.patient}</strong>
                    <span>{appointment.type}</span>
                  </div>
                  <div className={styles.appointmentMeta}>
                    <span>📅 {appointment.date}</span>
                    <span>⏱ {appointment.time}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default Agendamentos
