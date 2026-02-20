import { Link } from '@tanstack/react-router'
import type { ForumCategoryGroups } from '../../../types/forum'

type HomeContentProps = {
  responseStatus: number | null
  categories: ForumCategoryGroups | null
}

export default function HomeContent({ responseStatus, categories }: HomeContentProps) {
  return (
    <section className="forum-board">
      <div className="forum-status">
        API status: <strong>{responseStatus}</strong>
      </div>

      {Object.entries(categories ?? {}).map(([group, items]) => (
        <article className="forum-group" key={group}>
          <h2>
            {group === 'poe1' ? 'Path of Exile 1' : group === 'poe2' ? 'Path of Exile 2' : group}
          </h2>

          <ul className="forum-list">
            {items.map((item) => (
              <li className="forum-row" key={`${group}-${item.slug}`}>
                <div className="forum-row-main">
                  <Link
                    to="/category/$slug"
                    params={{ slug: item.slug }}
                    search={{ name: item.name, page: 1 }}
                  >
                    {item.name}
                  </Link>
                  <span className="forum-slug">/{item.slug}</span>
                </div>
                <span className="forum-endpoint">{item.endpoint}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  )
}
