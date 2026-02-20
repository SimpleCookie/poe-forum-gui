import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { AppShell } from './AppShell'
import { HomePage } from '../features/forum/pages/home/HomePage'
import { CategoryPage } from '../features/forum/pages/category/CategoryPage'
import { ThreadPage } from '../features/forum/pages/thread/ThreadPage'

const rootRoute = createRootRoute({
  component: AppShell,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$slug',
  validateSearch: (search: Record<string, unknown>) => ({
    name: typeof search.name === 'string' ? search.name : undefined,
    page: Math.max(1, Number(search.page ?? 1) || 1),
  }),
  component: CategoryPage,
})

const threadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/thread/$threadId',
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : undefined,
    page: Math.max(1, Number(search.page ?? 1) || 1),
  }),
  component: ThreadPage,
})

const routeTree = rootRoute.addChildren([indexRoute, categoryRoute, threadRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
