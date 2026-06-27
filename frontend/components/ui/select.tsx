import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils';

const Select = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Root {...props}>
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <SelectPrimitive.Icon />
      <SelectPrimitive.Value />
    </SelectPrimitive.Trigger>
    <SelectPrimitive.Content className="popover-popup w-56 w-56">
      {children}
    </SelectPrimitive.Content>
  </SelectPrimitive.Root>
));
Select.displayName = SelectPrimitive.Root.displayName;
export { Select };