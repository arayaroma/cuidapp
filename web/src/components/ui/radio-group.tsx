import * as React from "react"
import { cn } from "@/lib/utils"

const RadioGroupContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: '',
  onValueChange: () => {}
})

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange }}>
        <div
          ref={ref}
          className={cn("grid gap-2", className)}
          role="radiogroup"
          {...props}
        />
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, ...props }, ref) => {
    const { value: groupValue, onValueChange } = React.useContext(RadioGroupContext)
    
    return (
      <input
        type="radio"
        ref={ref}
        className={cn(
          "h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        checked={groupValue === props.value}
        onChange={(e) => {
          if (e.target.checked && props.value) {
            onValueChange(props.value as string)
          }
        }}
        {...props}
      />
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
