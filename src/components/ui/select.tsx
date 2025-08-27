'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SelectContextProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextProps>({
  value: undefined,
  onValueChange: undefined,
});

// Simple select component as a workaround
const Select = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: string; onValueChange?: (value: string) => void }>(
  ({ className, children, value, onValueChange, ...props }, ref) => {
    return (
      <SelectContext.Provider value={{ value, onValueChange }}>
        <div
          ref={ref}
          className={cn(
            'relative',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);
Select.displayName = 'Select';

const SelectGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-1', className)} {...props} />
);
SelectGroup.displayName = 'SelectGroup';

const SelectValue = ({ children, placeholder }: { children?: React.ReactNode; placeholder?: string }) => {
  const { value } = React.useContext(SelectContext);
  return <span>{value || placeholder}</span>;
};
SelectValue.displayName = 'SelectValue';

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 rural-input',
      className
    )}
    {...props}
  >
    {children}
  </button>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div 
      className={cn(
        'relative mt-1 w-full rounded-md border bg-background shadow-lg z-50',
        className
      )}
    >
      {children}
    </div>
  );
};
SelectContent.displayName = 'SelectContent';

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { onValueChange } = React.useContext(SelectContext);
    
    const handleClick = () => {
      onValueChange?.(value);
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectItem.displayName = 'SelectItem';

const SelectLabel = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)} {...props} />
);
SelectLabel.displayName = 'SelectLabel';

const SelectSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
  <hr className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
);
SelectSeparator.displayName = 'SelectSeparator';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};