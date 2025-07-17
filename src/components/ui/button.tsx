import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200",
        outline:
          "border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200",
        secondary:
          "bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-200",
        ghost: "hover:bg-blue-50 hover:text-blue-600 transition-all duration-200",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 transition-all duration-200",
        gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 shadow-md hover:shadow-lg transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
