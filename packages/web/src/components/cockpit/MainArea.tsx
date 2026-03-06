import Header from './Header'
import WorkspaceArea from './WorkspaceArea'

export default function MainArea() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header />
      <WorkspaceArea />
    </div>
  )
}
