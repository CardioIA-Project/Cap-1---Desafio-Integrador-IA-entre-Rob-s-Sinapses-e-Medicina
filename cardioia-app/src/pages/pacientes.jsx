import { useMemo, useState } from 'react'
import patientsData from '../data/patients.json'
import styles from '../App.module.css'

const RISK_LEVELS = {
  Alto: { label: 'Alto', style: 'high' },
  Médio: { label: 'Médio', style: 'medium' },
  Baixo: { label: 'Baixo', style: 'low' },
}

const getRiskLevel = (fc) => {
  if (fc > 85) return 'Alto'
  if (fc >= 75) return 'Médio'
  return 'Baixo'
}

const formatDate = (date) =>
  date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

const buildPatients = (data) =>
  data.map((item) => ({
    ...item,
    lastVisit: formatDate(new Date(item.lastVisit)),
    risk: getRiskLevel(item.fc),
  }))

function Pacientes() {
  const [patients] = useState(() => buildPatients(patientsData))

  const riskCounters = useMemo(() => {
    return patients.reduce(
      (summary, patient) => {
        summary[patient.risk] = (summary[patient.risk] || 0) + 1
        return summary
      },
      { Alto: 0, Médio: 0, Baixo: 0 },
    )
  }, [patients])

  return (
    <main className={styles.patientsPage}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Pacientes</h1>
          <p>Listagem de pacientes ativos no sistema</p>
        </div>
      </header>

      <div className={styles.summaryCards}>
        <article>
          <span className={styles.summaryLabel}>Total de pacientes</span>
          <strong>{patients.length}</strong>
        </article>
        <article>
          <span className={styles.summaryLabel}>Risco alto</span>
          <strong>{riskCounters.Alto}</strong>
        </article>
        <article>
          <span className={styles.summaryLabel}>Risco médio</span>
          <strong>{riskCounters.Médio}</strong>
        </article>
        <article>
          <span className={styles.summaryLabel}>Risco baixo</span>
          <strong>{riskCounters.Baixo}</strong>
        </article>
      </div>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2>Pacientes ativos</h2>
          <span>{`${patients.length} pacientes encontrados`}</span>
        </div>

        <div className={styles.patientsTableWrapper}>
          <table className={styles.patientsTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Condição</th>
                  <th>Última Visita</th>
                  <th>FC (bpm)</th>
                  <th>Risco</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.age} anos</td>
                    <td>{patient.condition}</td>
                    <td>{patient.lastVisit}</td>
                    <td className={styles.heartCell}>
                      <span aria-hidden="true">❤️</span> {patient.fc}
                    </td>
                    <td>
                      <span className={`${styles.riskBadge} ${styles[RISK_LEVELS[patient.risk].style]}`}>
                        {RISK_LEVELS[patient.risk].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </section>
    </main>
  )
}

export default Pacientes
