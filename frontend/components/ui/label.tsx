import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    className={(({} as any) === null || ({} as any) === void 0 ? void 0 : ({} as any).className) ?? ''}
    ref={ref}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };