export default function WelcomeCard() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5">
      <div className="w-full rounded-card bg-card p-8 shadow-card dark:bg-card-dark">
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
      <p className="text-xs text-text-secondary/60">
        Made with love in Scotland &middot; &copy; 2026{' '}
        <a href="https://www.unlikeotherai.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-secondary">
          UnlikeOtherAI
        </a>
      </p>
    </div>
  )
}
