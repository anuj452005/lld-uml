import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useParserStore } from '@/stores/parserStore';
import { ParserService } from '@/services/parserService';
import { ParserErrorList } from './ParserErrorList';
import { ParserWarningList } from './ParserWarningList';
import { Loader2, Code2, Zap } from 'lucide-react';

export const JavaEditorPanel: React.FC = () => {
  const [source, setSource] = useState<string>('');
  const { status, errors, warnings } = useParserStore();

  const handleGenerate = async () => {
    if (!source.trim() || status === 'loading') return;
    await ParserService.handleParseJava(source);
  };

  const isIdle = status === 'idle';
  const isLoading = status === 'loading';
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  return (
    <div className="flex flex-col h-full bg-bg-surface-primary overflow-hidden">
      {/* Header Info */}
      <div className="p-4 border-b border-border-primary">
        <div className="flex items-center gap-2 text-accent-primary mb-1">
          <Code2 size={18} />
          <h2 className="font-semibold">Java Code Import</h2>
        </div>
        <p className="text-text-tertiary text-xs">
          Paste your Java source code below to generate a UML diagram.
        </p>
      </div>

      {/* Editor Container */}
      <div className="flex-1 relative min-h-[400px]">
        <Editor
          height="100%"
          defaultLanguage="java"
          theme="vs-dark"
          value={source}
          onChange={(value) => setSource(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'var(--font-jetbrains-mono)',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: true,
            wordWrap: 'on'
          }}
        />
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-border-primary bg-bg-surface-secondary">
        <button
          onClick={handleGenerate}
          disabled={!source.trim() || isLoading}
          className={`
            w-full py-2.5 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-all
            ${isLoading 
              ? 'bg-accent-primary/50 text-text-primary/50 cursor-not-allowed' 
              : 'bg-accent-primary hover:bg-accent-primary-hover active:bg-accent-primary-active text-text-inverse shadow-md'
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Zap size={18} fill="currentColor" />
          )}
          <span>{isLoading ? 'Generating UML...' : 'Generate UML'}</span>
        </button>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          <ParserErrorList errors={errors} />
          <ParserWarningList warnings={warnings} />
        </div>

        {status === 'success' && !hasErrors && (
          <div className="mt-4 p-3 bg-status-success/10 border border-status-success/30 rounded-md text-status-success text-xs text-center animate-in fade-in slide-in-from-bottom-2">
            Successfully generated UML from Java source!
          </div>
        )}
      </div>
    </div>
  );
};
