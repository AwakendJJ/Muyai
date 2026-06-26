import { Drawer } from 'vaul';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

function Sheet({ ...props }) {
  return <Drawer.Root direction="left" {...props} />;
}

function SheetTrigger({ ...props }) {
  return <Drawer.Trigger {...props} />;
}

function SheetClose({ ...props }) {
  return <Drawer.Close {...props} />;
}

function SheetPortal({ ...props }) {
  return <Drawer.Portal {...props} />;
}

function SheetOverlay({ className, ...props }) {
  return (
    <Drawer.Overlay
      className={cn('fixed inset-0 z-50 bg-black/40', className)}
      {...props}
    />
  );
}

function SheetContent({ className, children, side = 'left', ...props }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Drawer.Content
        className={cn(
          'fixed z-50 flex flex-col gap-4 bg-white p-6 shadow-lg transition ease-in-out',
          side === 'left' && 'inset-y-0 left-0 h-full w-72 border-r border-gray-100',
          side === 'right' && 'inset-y-0 right-0 h-full w-72 border-l border-gray-100',
          className
        )}
        {...props}
      >
        {children}
        <Drawer.Close className="absolute right-4 top-4 rounded-lg p-1 opacity-70 hover:opacity-100">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Drawer.Close>
      </Drawer.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />;
}

function SheetTitle({ className, ...props }) {
  return <Drawer.Title className={cn('text-lg font-bold', className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle };
