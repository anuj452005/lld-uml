"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUMLStore } from '@/stores/umlStore';
import { useLayoutStore } from '@/stores/layoutStore';
import { useViewportStore } from '@/stores/viewportStore';
import { DiagramService } from '@/services/diagramService';

/**
 * useDiagramHydration
 * 
 * Hook to manage loading a diagram from the API and populating stores.
 * Orchestrates reload-safe state hydration.
 */
export function useDiagramHydration(diagramId: string | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setDiagram = useUMLStore((state) => state.setDiagram);
  const setNodes = useLayoutStore((state) => state.setNodes);
  const setViewport = useViewportStore((state) => state.setViewport);
  
  const supabase = createClient();

  useEffect(() => {
    async function hydrate() {
      if (!diagramId) return;
      
      setIsLoading(true);
      setIsHydrated(false);
      setError(null);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const diagram = await DiagramService.getDiagram(token, diagramId);
        
        // Populate Stores
        setDiagram(diagram);
        
        if (diagram.layout?.nodes) {
          setNodes(diagram.layout.nodes);
        }
        
        if (diagram.viewport) {
          setViewport(diagram.viewport);
        }
        
        setIsHydrated(true);
      } catch (err: any) {
        console.error('Hydration failed:', err);
        setError(err.message || 'Failed to load diagram');
      } finally {
        setIsLoading(false);
      }
    }

    hydrate();
  }, [diagramId, supabase, setDiagram, setNodes, setViewport]);

  return { isLoading, isHydrated, error };
}
