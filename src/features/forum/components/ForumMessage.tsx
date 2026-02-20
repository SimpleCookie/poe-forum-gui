type ForumMessageProps = {
  text: string
  variant?: 'default' | 'error'
}

export default function ForumMessage({ text, variant = 'default' }: ForumMessageProps) {
  if (variant === 'error') {
    return <p className="forum-message error">{text}</p>
  }

  return <p className="forum-message">{text}</p>
}
