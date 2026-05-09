import { UMLDiagram, DiagramSourceType } from '../types/uml';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api/v1';

export class DiagramService {
  /**
   * Helper to get common headers including auth token.
   */
  private static async getHeaders(): Promise<HeadersInit> {
    // In Next.js client side, we can't easily get the session here without a hook or context
    // So we'll pass the token as an argument to the service methods instead.
    return {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Helper to handle unauthorized responses
   */
  private static handleUnauthorized(response: Response) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }
  }

  static async createDiagram(token: string, name: string, sourceType: DiagramSourceType): Promise<string> {
    const response = await fetch(`${API_URL}/diagrams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, sourceType })
    });

    this.handleUnauthorized(response);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data.diagramId;
  }

  static async listDiagrams(token: string): Promise<any[]> {
    const response = await fetch(`${API_URL}/diagrams`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    this.handleUnauthorized(response);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data.diagrams;
  }

  static async getDiagram(token: string, id: string): Promise<UMLDiagram> {
    const response = await fetch(`${API_URL}/diagrams/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    this.handleUnauthorized(response);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data.diagram;
  }

  static async updateDiagram(
    token: string,
    id: string,
    diagram: UMLDiagram,
    layout: UMLDiagram['layout'],
    viewport: UMLDiagram['viewport']
  ): Promise<void> {
    const response = await fetch(`${API_URL}/diagrams/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ diagram, layout, viewport })
    });

    this.handleUnauthorized(response);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
  }
}
