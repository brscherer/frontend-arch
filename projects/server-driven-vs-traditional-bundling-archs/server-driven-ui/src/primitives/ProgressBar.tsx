interface Props {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  return (
    <div className="progress">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`step-dot ${i === current ? "active" : ""} ${i < current ? "done" : ""}`}
        >
          {i + 1}
        </span>
      ))}
    </div>
  )
}
