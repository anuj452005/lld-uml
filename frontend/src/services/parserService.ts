import { parseJava } from '@repo/parser-client';
import { useParserStore } from '@/stores/parserStore';
import { useUMLStore } from '@/stores/umlStore';

export class ParserService {
  /**
   * Parses Java source code and updates the application state.
   * 
   * @param source The Java source code string
   */
  static async handleParseJava(source: string): Promise<void> {
    const parserStore = useParserStore.getState();
    const umlStore = useUMLStore.getState();

    // 1. Initial state
    parserStore.setStatus('loading');
    parserStore.setLastParsedSource(source);

    try {
      // 2. Call API
      const result = await parseJava(source);

      // 3. Update status/results
      parserStore.setResult(result.warnings, result.errors);

      // 4. If success, update the diagram in UML store
      if (result.success && result.diagram) {
        umlStore.setDiagram(result.diagram);
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
