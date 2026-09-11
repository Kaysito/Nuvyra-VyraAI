import { getPointsToNextLevel, getVyraLevel, getVyraLevelProgress } from "../demo/vyraPoints";

export function VyraPointsCard({ points }: { points: number }) {
  const level = getVyraLevel(points);
  const progress = getVyraLevelProgress(points);
  const pointsToNextLevel = getPointsToNextLevel(points);

  return <section className="glass-card vyra-points-card" aria-labelledby="vyra-points-title">
    <div className="vyra-points-heading">
      <div>
        <p className="micro-label">PROGRESO DE LA DEMO</p>
        <h2 id="vyra-points-title">VyraPoints</h2>
      </div>
      <strong>{points} pts</strong>
    </div>
    <div className="vyra-points-meta">
      <span>Nivel actual</span>
      <b>Nivel {level}</b>
    </div>
    <div
      className="vyra-points-progress"
      role="progressbar"
      aria-label="Progreso de VyraPoints hacia el siguiente nivel"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <span style={{ width: `${progress}%` }} />
    </div>
    <p className="vyra-points-next">{pointsToNextLevel} puntos para alcanzar el Nivel {level + 1}.</p>
    <small>Puntos de la demo educativa para reconocer tu recorrido. No representan dinero ni se guardan al recargar.</small>
  </section>;
}
