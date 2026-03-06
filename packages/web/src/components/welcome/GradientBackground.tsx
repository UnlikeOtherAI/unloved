export default function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-140px] left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gradient-top opacity-70 blur-[120px] dark:bg-gradient-mid dark:opacity-25" />
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-mid opacity-30 blur-[120px] dark:opacity-15" />
      <div className="absolute right-[-100px] bottom-[-100px] h-[350px] w-[350px] rounded-full bg-linear-to-br from-gradient-pink to-gradient-red opacity-40 blur-[120px] dark:opacity-20" />
    </div>
  )
}
