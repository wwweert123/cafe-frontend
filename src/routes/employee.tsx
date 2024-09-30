import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employee')({
  component: () => <div>Hello /employee!</div>,
})
