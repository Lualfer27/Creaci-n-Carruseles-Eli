import React, { useState, useEffect, useMemo } from 'react';
import { AspectRatio, TypographySettings, ImageConfig, INITIAL_PALETTE, DEFAULT_PALETTE, FONTS, RATIO_TO_DIMENSIONS } from './types';
import Sidebar from './components/Sidebar';
import Gallery from './components/Gallery';
import EditModal from './components/EditModal';
import { generateRandomColorSequence } from './utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [text, setText] = useState('Nunca fue tarde.\nTodo cambia.\nAprende a soltar.');
  const [globalRatio, setGlobalRatio] = useState<AspectRatio>('4:5');
  const [globalTypography, setGlobalTypography] = useState<TypographySettings>({
    fontFamily: 'font-cormorant',
    fontWeight: '400',
    fontSize: 80,
    color: '#999898',
    lineHeight: 1.2,
    letterSpacing: -1,
    padding: 64,
    align: 'center',
  });
  const [applyToAll, setApplyToAll] = useState(true);
  
  const [images, setImages] = useState<ImageConfig[]>([]);
  const [editingImage, setEditingImage] = useState<ImageConfig | null>(null);

  useEffect(() => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    const bgSequence = generateRandomColorSequence(lines.length, INITIAL_PALETTE);
    
    setImages(prevImages => {
      return lines.map((line, ix) => {
        const existing = prevImages[ix];
        // If applyToAll is true, we force override the styles with global
        // Else, we keep existing individual styles, only override text
        if (existing) {
          return {
            ...existing,
            text: line,
            ...(applyToAll ? {
              ratio: globalRatio,
              typography: globalTypography,
            } : {})
          };
        }
        
        return {
          id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
          text: line,
          ratio: globalRatio,
          background: bgSequence[ix].hex,
          typography: globalTypography
        };
      });
    });
    // We intentionally don't add images to deps to avoid infinite loops if images state updates itself
    // But we need to respond to text/global changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, globalRatio, globalTypography, applyToAll]);

  const handleUpdateImage = (updated: ImageConfig) => {
    setImages(prev => prev.map(img => img.id === updated.id ? updated : img));
  };

  const handleDuplicateImage = (img: ImageConfig) => {
     // Not perfectly syncing text, but we'll add text for now
     setText(prev => prev + '\n' + img.text);
  };

  return (
    <div className="flex bg-white text-gray-900 font-sans h-screen w-screen overflow-hidden">
      <Sidebar 
         text={text} 
         setText={setText}
         globalRatio={globalRatio}
         setGlobalRatio={setGlobalRatio}
         globalTypography={globalTypography}
         setGlobalTypography={setGlobalTypography}
         applyToAll={applyToAll}
         setApplyToAll={setApplyToAll}
         images={images}
      />
      <Gallery 
         images={images} 
         onEdit={setEditingImage} 
         onDuplicate={handleDuplicateImage} 
      />
      <AnimatePresence>
        {editingImage && (
          <EditModal 
             image={editingImage} 
             onClose={() => setEditingImage(null)} 
             onUpdate={handleUpdateImage} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
