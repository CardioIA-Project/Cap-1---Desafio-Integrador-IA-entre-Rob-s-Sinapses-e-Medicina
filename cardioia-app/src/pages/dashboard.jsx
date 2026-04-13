import { useEffect, useRef, useState } from 'react'
import patientsData from '../data/patients.json'
import styles from '../App.module.css'

const CHART_WIDTH = 760
const CHART_HEIGHT = 240
const CHART_PADDING = 40

function buildPoints(data, key, maxValue) {
  const xStep = (CHART_WIDTH - CHART_PADDING * 2) / (data.length - 1)

  return data
    .map((item, index) => {
      const x = CHART_PADDING + index * xStep
      const y =
        CHART_HEIGHT -
        CHART_PADDING -
        (item[key] / maxValue) * (CHART_HEIGHT - CHART_PADDING * 2)
      return `${x},${y}`
    })
    .join(' ')
}

function isWithinNext7Days(dateString) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 7)

  const appointmentDate = new Date(dateString)
  if (Number.isNaN(appointmentDate.getTime())) {
    return false
  }

  appointmentDate.setHours(0, 0, 0, 0)
  return appointmentDate >= today && appointmentDate <= maxDate
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [appointmentsCount, setAppointmentsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const chartWrapperRef = useRef(null)

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/dashboard').then((res) => {
        if (!res.ok) {
          throw new Error('Falha ao carregar dados do dashboard')
        }
        return res.json()
      }),
      fetch('http://localhost:3000/appointments').then((res) => {
        if (!res.ok) {
          throw new Error('Falha ao carregar agendamentos')
        }
        return res.json()
      }),
    ])
      .then(([dashboard, appointments]) => {
        setDashboardData(dashboard)
        const upcomingCount = appointments.filter((appointment) =>
          isWithinNext7Days(appointment.date)
        ).length
        setAppointmentsCount(upcomingCount)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const monthlyData = dashboardData?.monthlyData || []
  const totalPatients = patientsData.length
  const highRiskRate = dashboardData?.highRiskRate ?? 0
  const maxValue = monthlyData.length
    ? Math.max(...monthlyData.map((item) => Math.max(item.pacientes, item.consultas)))
    : 0

  const showTooltip = (item) => (event) => {
    if (!chartWrapperRef.current) return
    const rect = chartWrapperRef.current.getBoundingClientRect()
    setTooltip({
      label: item.label,
      pacientes: item.pacientes,
      consultas: item.consultas,
      top: event.clientY - rect.top + 12,
      left: event.clientX - rect.left + 12,
    })
  }

  const hideTooltip = () => setTooltip(null)
  const patientsPath = buildPoints(monthlyData, 'pacientes', maxValue || 1)
  const consultsPath = buildPoints(monthlyData, 'consultas', maxValue || 1)

  return (
    <main className={styles.dashboardPage}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral dos pacientes e consultas agendadas.</p>
        </div>
      </header>

      <div className={styles.dashboardCards}>
        <article className={styles.dashboardCard}>
          <small>Total de pacientes</small>
          <strong>{loading ? '...' : totalPatients}</strong>
          <p>Ativos no sistema</p>
        </article>

        <article className={styles.dashboardCard}>
          <small>Consultas agendadas</small>
          <strong>{loading ? '...' : appointmentsCount}</strong>
          <p>Próximos 7 dias</p>
        </article>

        <article className={styles.dashboardCard}>
          <small>Taxa de risco alto</small>
          <strong>{loading ? '...' : `${highRiskRate}%`}</strong>
          <p>Requer atenção</p>
        </article>
      </div>

      <section className={styles.dashboardChartCard}>
        <div className={styles.dashboardChartHeader}>
          <h2>Evolução Mensal</h2>
          <span>Últimos 12 meses</span>
        </div>

        {error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div className={styles.chartWrapper} ref={chartWrapperRef}>
            <svg
              className={styles.chartSvg}
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              role="img"
              aria-label="Evolução mensal de pacientes e consultas"
              onMouseLeave={hideTooltip}
            >
              <defs>
                <linearGradient id="patientsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>

              <g stroke="#e2e8f0" strokeWidth="1">
                {[1, 2, 3, 4].map((row) => {
                  const y = CHART_PADDING + (row * (CHART_HEIGHT - CHART_PADDING * 2)) / 4
                  return <line key={row} x1={CHART_PADDING} y1={y} x2={CHART_WIDTH - CHART_PADDING} y2={y} />
                })}
              </g>

              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                points={patientsPath}
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points={consultsPath}
              />

              {monthlyData.map((item, index) => {
                const x = CHART_PADDING +
                  (index * (CHART_WIDTH - CHART_PADDING * 2)) / (monthlyData.length - 1)
                const yPatients =
                  CHART_HEIGHT -
                  CHART_PADDING -
                  (item.pacientes / maxValue) * (CHART_HEIGHT - CHART_PADDING * 2)
                const yConsults =
                  CHART_HEIGHT -
                  CHART_PADDING -
                  (item.consultas / maxValue) * (CHART_HEIGHT - CHART_PADDING * 2)

                return (
                  <g key={item.label}>
                    <circle
                      cx={x}
                      cy={yPatients}
                      r="5"
                      fill="#2563eb"
                      onMouseEnter={showTooltip(item)}
                      onMouseMove={showTooltip(item)}
                    />
                    <circle
                      cx={x}
                      cy={yConsults}
                      r="5"
                      fill="#10b981"
                      onMouseEnter={showTooltip(item)}
                      onMouseMove={showTooltip(item)}
                    />
                  </g>
                )
              })}
            </svg>

            <div className={styles.chartTooltip} style={{
              opacity: tooltip ? 1 : 0,
              top: tooltip?.top,
              left: tooltip?.left,
            }}>
              {tooltip && (
                <>
                  <div className={styles.tooltipHeader}>{tooltip.label}</div>
                  <div className={styles.tooltipItem}>
                    <span className={styles.tooltipMarker} style={{ background: '#2563eb' }} />
                    <span>Pacientes</span>
                    <strong>{tooltip.pacientes}</strong>
                  </div>
                  <div className={styles.tooltipItem}>
                    <span className={styles.tooltipMarker} style={{ background: '#10b981' }} />
                    <span>Consultas</span>
                    <strong>{tooltip.consultas}</strong>
                  </div>
                </>
              )}
            </div>

            <div className={styles.monthsRow}>
              {monthlyData.map((item) => (
                <span key={item.label}>{item.label}</span>
              ))}
            </div>

            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendMarker} style={{ background: '#2563eb' }} />
                <span className={styles.label}>Pacientes</span>
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendMarker} style={{ background: '#10b981' }} />
                <span className={styles.label}>Consultas</span>
              </span>
            </div>

          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard
