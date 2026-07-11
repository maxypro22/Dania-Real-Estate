import { cn } from '@/lib/utils'

export function Card({ className, ...props }: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn('bg-white rounded-2xl border border-border hover:shadow-md transition-shadow duration-200', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return <div className={cn('p-6', className)} {...props} />
}
