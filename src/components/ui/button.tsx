import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground shadow-lg border-2 border-primary/20 hover:from-primary/90 hover:via-primary/85 hover:to-primary/80 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-semibold",
        destructive:
          "bg-gradient-to-br from-destructive via-destructive to-destructive/90 text-white shadow-lg border-2 border-destructive/20 hover:from-destructive/90 hover:via-destructive/85 hover:to-destructive/80 hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 font-semibold",
        outline:
          "border-2 border-primary/30 bg-background/80 backdrop-blur-sm shadow-md hover:bg-primary/5 hover:border-primary/50 hover:shadow-lg dark:bg-input/30 dark:border-input dark:hover:bg-input/50 font-medium",
        secondary:
          "bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-secondary-foreground shadow-md border border-secondary/20 hover:from-secondary/90 hover:via-secondary/85 hover:to-secondary/80 hover:shadow-lg font-medium",
        ghost:
          "hover:bg-accent/20 hover:text-accent-foreground dark:hover:bg-accent/50 backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        rural:
          "bg-gradient-to-br from-accent via-accent to-accent/90 text-accent-foreground shadow-lg border-2 border-accent/30 hover:from-accent/90 hover:via-accent/85 hover:to-accent/80 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-semibold text-shadow",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4 rounded-lg",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
