import { useState } from 'react'
import SidebarNarrow from './SidebarNarrow.jsx'
import SidebarWide from './SidebarWide.jsx'

// .xxDqK8n (sticky h-100vh) > .nSJCjRt (bg primary, flex) > [.TDao5NC, .U3LNHaQ.xVuhqDn]
// Широкий — visibility:hidden + opacity:0 по умолчанию, появляется по hover на .nSJCjRt.
// На <768px узкий сайдбар становится fixed translateX(-100%) — заглушка-drawer.
export default function Sidebar() {
  const [hover, setHover] = useState(false)
  return (
    <div className="sticky top-0 h-screen">
      <div
        className="flex select-none bg-af-bg-primary"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <SidebarNarrow />
        <SidebarWide visible={hover} />
      </div>
    </div>
  )
}
