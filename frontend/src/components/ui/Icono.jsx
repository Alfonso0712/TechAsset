import {
  Clock, CircleCheck, CircleX, Ban, Monitor, Presentation, Users,
  LayoutDashboard, Sun, Moon, Menu, X, Eye, EyeOff, ChevronDown,
  ChevronRight, ChevronLeft, LogOut, AlertTriangle, Info, Search,
  Plus, Check, Loader2, HelpCircle, Wrench, Pencil, ArrowLeft,
  MoreHorizontal, Power, Laptop, Printer, Tablet, Wifi, Cpu,
  ClipboardList, BarChart3, Filter, RotateCcw, CheckCircle2, XCircle,
  FileText, ShieldCheck, History, UserCheck, PackageCheck, RefreshCw,
  Building2, Network, Tv, Download, ArrowRight
} from 'lucide-react';

const ICONOS = {
  Clock, CircleCheck, CircleX, Ban, Monitor, Presentation, Users,
  LayoutDashboard, Sun, Moon, Menu, X, Eye, EyeOff, ChevronDown,
  ChevronRight, ChevronLeft, LogOut, AlertTriangle, Info, Search,
  Plus, Check, Loader2, HelpCircle, Wrench, Pencil, ArrowLeft,
  MoreHorizontal, Power, Laptop, Printer, Tablet, Wifi, Cpu,
  ClipboardList, BarChart3, Filter, RotateCcw, CheckCircle2, XCircle,
  FileText, ShieldCheck, History, UserCheck, PackageCheck, RefreshCw,
  Building2, Network, Tv, Download, ArrowRight
};

export default function Icono({
  nombre,
  className = 'w-4 h-4 shrink-0',
  strokeWidth = 1.8,
  ...props
}) {
  const Componente = ICONOS[nombre] || Info;
  return (
    <Componente
      className={`shrink-0 ${className}`}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    />
  );
}
