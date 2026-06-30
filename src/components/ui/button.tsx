import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-full',
  {
    variants: {
      variant: {
        primary:   'bg-lime text-forest hover:bg-lime-dark shadow-sm',
        dark:      'bg-forest text-white hover:bg-forest-mid',
        outline:   'bg-white border border-border text-ink hover:bg-surface-low',
        ghost:     'text-forest hover:bg-surface-green',
        whatsapp:  'bg-whatsapp text-white hover:opacity-90',
        lime:      'bg-lime text-forest hover:bg-lime-dark',
      },
      size: {
        sm: 'text-sm px-5 py-2',
        md: 'text-sm px-6 py-3',
        lg: 'text-base px-8 py-4',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: Readonly<ButtonProps>) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
