interface MetricCardProps {
  label: string
  value: string
  detail: string
}

export default function MetricCard({ detail, label, value }: MetricCardProps) {
  return (
    <article className="rounded-[28px] border border-[#e7e7ea] bg-white p-6 shadow-[0_16px_36px_rgba(17,17,20,0.05)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[#8a8a92]">{label}</p>
      <p className="mt-4 font-display text-4xl text-[#111114]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[#3c3c43]">{detail}</p>
    </article>
  )
}
