interface AppLoadingProps {
  label?: string
}

export default function AppLoading({ label = 'Loading…' }: AppLoadingProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 text-sm"
      style={{
        background:
          'radial-gradient(120% 130% at 0% 0%, rgba(197,232,108,0.2) 0%, transparent 38%), radial-gradient(90% 120% at 100% 0%, rgba(207,233,245,0.5) 0%, transparent 42%), linear-gradient(180deg, #ffffff 0%, #f9faf7 100%)',
        color: '#3c3c43',
      }}
    >
      <div className="rounded-full border border-[#e7e7ea] bg-white/90 px-5 py-3 shadow-[0_12px_30px_rgba(17,17,20,0.05)]">
        {label}
      </div>
    </div>
  )
}
