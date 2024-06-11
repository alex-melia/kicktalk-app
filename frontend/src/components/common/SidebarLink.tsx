import { ReactElement } from "react"
import { Link } from "react-router-dom"

interface SidebarLinkProps {
  name: string
  to: string
  icon: ReactElement
}

export default function SidebarLink({ name, to, icon }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className="grid grid-flow-col justify-start grid-cols-[1fr, auto] gap-5 cursor-pointer items-center p-3 rounded-3xl hover:bg-slate-50 transition-colors"
    >
      {icon}
      <a className="text-xl 2xl:text-2xl hidden xl:block">{name}</a>
    </Link>
  )
}
