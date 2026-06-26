import AppSidebar from './AppSidebar.jsx';
import { Sheet, SheetContent } from '../ui/sheet.jsx';

export default function MobileNav({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <AppSidebar onNavigate={() => onOpenChange(false)} className="border-0" />
      </SheetContent>
    </Sheet>
  );
}
