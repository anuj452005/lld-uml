import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useParserStore } from '@/stores/parserStore';
import { useUMLStore } from '@/stores/umlStore';
import { ParserService } from '@/services/parserService';
import { ParserErrorList } from './ParserErrorList';
import { ParserWarningList } from './ParserWarningList';
import { Loader2, Code2, Zap, AlertTriangle } from 'lucide-react';

import { createClient } from '@/utils/supabase/client';

export const JavaEditorPanel: React.FC = () => {
  const [source, setSource] = useState<string>('');
  const { status, errors, warnings } = useParserStore();
  const supabase = createClient();

  const { diagram } = useUMLStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleGenerate = async (force: boolean = false) => {
    if (!source.trim() || status === 'loading') return;

    // Check if we need confirmation
    if (!force && diagram?.sourceType === 'mixed') {
      setShowConfirm(true);
      return;
    }

    setShowConfirm(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session found');
      return;
    }

    await ParserService.handleParseJava(source, session.access_token);
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
      <div className="flex-1 relative overflow-hidden">
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
        {showConfirm && (
          <div className="mb-4 p-3 bg-status-warning/10 border border-status-warning/30 rounded-md animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-2 text-status-warning mb-2">
              <AlertTriangle size={16} className="shrink-0" />
              <p className="text-xs font-semibold">Overwrite manual edits?</p>
            </div>
            <p className="text-[10px] text-text-tertiary mb-3">
              This diagram has manual modifications. Regenerating from Java will overwrite all manual changes.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerate(true)}
                className="flex-1 py-1.5 bg-status-warning text-text-inverse rounded text-[10px] font-bold hover:bg-status-warning/90"
              >
                Confirm Overwrite
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-1.5 bg-bg-surface-tertiary text-text-primary rounded text-[10px] font-bold border border-border-primary hover:bg-bg-surface-hover"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => handleGenerate(false)}
          disabled={!source.trim() || isLoading || showConfirm}
          className={`
            w-full py-2.5 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-all
            ${isLoading || showConfirm
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
