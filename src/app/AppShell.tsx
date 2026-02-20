import { Link, Outlet } from '@tanstack/react-router'
import './app.css'

export const AppShell = () => {
  return (
    <main className="forum-app">
      <header className="forum-header">
        <h1>
          <Link to="/">Path of Exile Forums</Link>
        </h1>
        <p className="forum-subtitle">Browse categories, threads and posts</p>
      </header>

      <Outlet />

      <p className="forum-footer">
        Data source: <strong>@devgroup.se/poe-forum-api</strong>
      </p>
    </main>
  )
}
