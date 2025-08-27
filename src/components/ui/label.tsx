import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        error: "text-destructive",
      },
    },
    defaultVariants: {
      size: "md",
      color: "default",
    },
  }
)

type LabelVariants = VariantProps<typeof labelVariants>

export interface LabelProps
  extends Omit<React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, keyof LabelVariants>,
    LabelVariants {}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, size, color, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ size, color }), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }