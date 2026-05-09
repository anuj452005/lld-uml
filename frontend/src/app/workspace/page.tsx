"use client";

import React, { useEffect, useState } from 'react';
import { Plus, FileText, Clock, ChevronRight } from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { createClient } from '@/utils/supabase/client';
import { DiagramService } from '@/services/diagramService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WorkspaceLandingPage() {
  const [diagrams, setDiagrams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSessionStore();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadDiagrams() {
      if (!user) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const list = await DiagramService.listDiagrams(session.access_token);
        setDiagrams(list);
      } catch (error) {
        console.error('Failed to load diagrams:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDiagrams();
  }, [user, supabase]);

  const handleCreateDiagram = async () => {
    const name = prompt('Enter diagram name:');
    if (!name) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const id = await DiagramService.createDiagram(session.access_token, name, 'manual');
      router.push(`/workspace/${id}`);
    } catch (error) {
      alert('Failed to create diagram');
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">My Diagrams</h1>
            <p className="text-text-secondary">Manage your architecture and LLD designs</p>
          </div>
          <button 
            onClick={handleCreateDiagram}
            className="flex items-center gap-2 bg-accent-primary hover:bg-accent-primary-hover text-text-inverse px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-accent-primary/20"
          >
            <Plus size={20} />
            New Diagram
          </button>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[160px] bg-bg-surface-secondary rounded-xl border border-border-primary" />
            ))}
          </div>
        ) : diagrams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border-secondary rounded-2xl bg-bg-surface-primary/50">
            <div className="w-16 h-16 bg-bg-surface-tertiary rounded-full flex items-center justify-center text-text-tertiary mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No diagrams yet</h3>
            <p className="text-text-tertiary mb-8">Start by creating your first UML diagram</p>
            <button 
              onClick={handleCreateDiagram}
              className="text-accent-primary font-medium hover:underline flex items-center gap-1"
            >
              Create my first diagram <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagrams.map((diagram) => (
              <Link 
                key={diagram.id} 
                href={`/workspace/${diagram.id}`}
                className="group bg-bg-surface-secondary border border-border-primary rounded-xl p-5 hover:border-accent-primary transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-bg-surface-tertiary rounded-lg text-text-secondary group-hover:text-accent-primary transition-colors">
                    <FileText size={24} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-bg-surface-tertiary text-text-tertiary rounded-md">
                    {diagram.source_type}
                  </span>
                </div>
                <h3 className="font-bold text-text-primary mb-1 truncate">{diagram.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <Clock size={12} />
                  <span>Updated {new Date(diagram.updated_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
