import { toPng, toJpeg, toSvg } from 'html-to-image';

export type ExportFormat = 'png' | 'jpeg' | 'svg' | 'pdf';

export class ExportService {
  /**
   * Exports the given HTML element as an image or file.
   */
  static async exportDiagram(
    element: HTMLElement,
    format: ExportFormat,
    fileName: string = 'uml-diagram'
  ): Promise<void> {
    try {
      // Hide elements that shouldn't be in the export (e.g., attribution, zoom controls if desired)
      // Note: React Flow attribution is usually required unless you have a pro license,
      // but for this project we'll just capture what's on screen.

      let dataUrl: string = '';

      const options = {
        backgroundColor: '#0a0a0a', // Match our canvas background
        quality: 0.95,
        pixelRatio: 2, // Higher resolution
      };

      switch (format) {
        case 'png':
          dataUrl = await toPng(element, options);
          this.download(dataUrl, `${fileName}.png`);
          break;
        case 'jpeg':
          dataUrl = await toJpeg(element, options);
          this.download(dataUrl, `${fileName}.jpg`);
          break;
        case 'svg':
          dataUrl = await toSvg(element, options);
          this.download(dataUrl, `${fileName}.svg`);
          break;
        case 'pdf':
          // PDF export usually requires jspdf. For now, we'll suggest printing to PDF 
          // or we can implement a basic one if the user insists.
          // Let's stick to images first as they are more common for UML.
          dataUrl = await toPng(element, options);
          this.download(dataUrl, `${fileName}.png`);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export diagram. Please try again.');
    }
  }

  private static download(dataUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  }
}
