import styles from './ColorRamp.module.css'

type ColorStop = { name: string; value: string }

export function ColorRamp({ name, stops }: { name: string; stops: ColorStop[] }) {
  return (
    <section className={styles.ramp}>
      <h3>{name}</h3>
      <div className={styles.stops}>
        {stops.map((stop) => (
          <div className={styles.stop} key={stop.name}>
            <div className={styles.color} style={{ background: stop.value }} />
            <strong>{stop.name}</strong>
            <code>{stop.value}</code>
          </div>
        ))}
      </div>
    </section>
  )
}
