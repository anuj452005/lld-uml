import React, { useState } from 'react';
import { Download, FileImage, FileType, ChevronDown, Loader2 } from 'lucide-react';
import { ExportService, ExportFormat } from '@/services/exportService';
import { useUMLStore } from '@/stores/umlStore';
import { useToast } from '@/components/ui/ToastProvider';

export const ExportMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();
  const diagramName = useUMLStore((state) => state.diagram?.name || 'diagram');

  const handleExport = async (format: ExportFormat) => {
    const flowElement = document.querySelector('.react-flow') as HTMLElement;
    
    if (!flowElement) {
      showToast('Could not find diagram canvas', 'error');
      return;
    }

    setIsExporting(true);
    setIsOpen(false);

    try {
      // Small delay to ensure any UI overlays are settled
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await ExportService.exportDiagram(flowElement, format, diagramName.toLowerCase().replace(/\s+/g, '-'));
      showToast(`Diagram exported as ${format.toUpperCase()}`, 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-1.5 px-3 py-2 hover:bg-bg-surface-tertiary rounded-md text-text-secondary hover:text-text-primary transition-all active:scale-95 disabled:opacity-50"
        title="Export Diagram"
      >
        {isExporting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Download size={18} />
        )}
        <span className="text-xs font-bold uppercase tracking-wider">Export</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-48 bg-bg-surface-primary border border-border-primary rounded-xl shadow-2xl z-[70] py-2 animate-in fade-in zoom-in-95 duration-200">
            <p className="px-4 py-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest border-b border-border-primary mb-1">
              Select Format
            </p>
            
            <ExportOption 
              label="PNG Image" 
              icon={<FileImage size={16} />} 
              onClick={() => handleExport('png')} 
            />
            <ExportOption 
              label="JPEG Image" 
              icon={<FileImage size={16} />} 
              onClick={() => handleExport('jpeg')} 
            />
            <ExportOption 
              label="SVG Vector" 
              icon={<FileType size={16} />} 
              onClick={() => handleExport('svg')} 
            />
            <div className="h-[1px] bg-border-primary my-1 mx-2" />
            <ExportOption 
              label="PDF Document" 
              icon={<FileType size={16} />} 
              onClick={() => handleExport('pdf')} 
              description="Print-ready"
            />
          </div>
        </>
      )}
    </div>
  );
};

const ExportOption: React.FC<{ 
  label: string; 
  icon: React.ReactNode; 
  onClick: () => void;
  description?: string;
}> = ({ label, icon, onClick, description }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors text-left group"
  >
    <div className="text-text-tertiary group-hover:text-accent-primary transition-colors">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium">{label}</span>
      {description && <span className="text-[10px] text-text-tertiary">{description}</span>}
    </div>
  </button>
);
