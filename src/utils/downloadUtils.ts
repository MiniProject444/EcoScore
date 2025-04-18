
import { toPng } from 'html-to-image';

export const downloadCalculationResults = async () => {
  try {
    // Find the container element that has all the results
    const resultsContainer = document.querySelector('#results-container');
    if (!resultsContainer) {
      throw new Error('Results container not found');
    }

    // Cast the Element to HTMLElement for compatibility with html-to-image
    const htmlElement = resultsContainer as HTMLElement;

    // Convert the container to an image
    const dataUrl = await toPng(htmlElement);

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.download = `eco-footprint-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error downloading results:', error);
    throw error;
  }
};
