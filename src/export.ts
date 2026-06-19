import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ImageConfig, RATIO_TO_DIMENSIONS } from './types';

const TARGET_WIDTH = 1080;

// Export helpers

export const downloadSingleImage = async (id: string, filename = 'export.png') => {
  const element = document.getElementById(`canvas-${id}`);
  if (!element) return;
  
  // Compute pixelRatio to force a 1080px wide export
  const scale = TARGET_WIDTH / element.clientWidth;

  try {
    const dataUrl = await htmlToImage.toPng(element, { 
      quality: 1,
      pixelRatio: scale,
    });
    
    saveAs(dataUrl, filename);
  } catch (err) {
    console.error('Error exporting image', err);
  }
};

export const downloadMultipleImages = async (images: ImageConfig[]) => {
  const zip = new JSZip();

  for (let i = 0; i < images.length; i++) {
    const element = document.getElementById(`canvas-${images[i].id}`);
    if (element) {
      const scale = TARGET_WIDTH / element.clientWidth;
      const dataUrl = await htmlToImage.toPng(element, { 
        quality: 1,
        pixelRatio: scale,
      });
      const base64Data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
      zip.file(`image-${i + 1}.png`, base64Data, { base64: true });
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "export-images.zip");
};
