import { parseJava } from '@repo/parser-client';
import { autoLayoutDiagram } from '@repo/diagram-engine';
import { useParserStore } from '@/stores/parserStore';
import { useUMLStore } from '@/stores/umlStore';
import { useLayoutStore } from '@/stores/layoutStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api/v1';

export class ParserService {
  /**
   * Parses Java source code and updates the application state.
   * 
   * @param source The Java source code string
   * @param token The auth token
   */
  static async handleParseJava(source: string, token: string): Promise<void> {
    const parserStore = useParserStore.getState();
    const umlStore = useUMLStore.getState();
    const layoutStore = useLayoutStore.getState();

    // 1. Initial state
    parserStore.setStatus('loading');
    parserStore.setLastParsedSource(source);

    try {
      // 2. Call API
      const result = await parseJava(source, API_URL, token);

      // 3. Update status/results
      parserStore.setResult(result.warnings, result.errors);

      // 4. If success, update the diagram in UML store
      if (result.success && result.diagram) {
        // Apply auto-layout if layout is empty
        if (!result.diagram.layout.nodes || result.diagram.layout.nodes.length === 0) {
          const autoNodes = autoLayoutDiagram(result.diagram);
          result.diagram.layout.nodes = autoNodes;
          
          // Also sync to layout store
          layoutStore.setNodes(autoNodes);
        }

        umlStore.setDiagram(result.diagram);
        parserStore.setStatus('success');
      } else if (!result.success) {
        parserStore.setStatus('error');
      }
    } catch (error: any) {
      // 5. Handle unexpected network/system errors
      parserStore.setStatus('error');
      parserStore.setResult([], [
        {
          code: 'UNEXPECTED_ERROR',
          message: error.message || 'An unexpected error occurred during parsing.',
        }
      ]);
    }
  }
}
