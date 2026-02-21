import { Link, Outlet } from '@tanstack/react-router'
import './app.css'

export const AppShell = () => {
  return (
    <main className="forum-app">
      <header className="forum-header">
        <h1>
          <Link to="/">Path of Exile Forums</Link>
          <span className="forum-unofficial-badge">Unofficial</span>
        </h1>
        <p className="forum-subtitle">Community &mdash; Announcements &amp; Discussion</p>
      </header>

      <Outlet />

      <p className="forum-footer">
        Unofficial reader &mdash; data via <strong>@devgroup.se/poe-forum-api</strong>
      </p>
    </main>
  )
}
