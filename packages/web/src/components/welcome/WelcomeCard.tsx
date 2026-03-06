export default function WelcomeCard() {
  return (
    <div className="w-full max-w-md rounded-card bg-card p-8 shadow-card dark:bg-card-dark">
      <div className="flex flex-col items-center gap-3">
        <img src="/logo.png" alt="unloved" className="h-12 w-12" />
        <h1 className="text-[28px] font-semibold text-text-primary dark:text-text-dark">unloved</h1>
        <p className="text-sm text-text-secondary">Local AI coding cockpit</p>
      </div>
      <div className="h-6" />
      <p className="text-center text-sm text-text-secondary">
        Select a session from the sidebar to get started, or create a new one.
      </p>
    </div>
  )
}
