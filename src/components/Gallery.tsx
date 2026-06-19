import React from 'react';
import { ImageConfig, RATIO_TO_DIMENSIONS } from '../types';
import { Edit2, Copy, Download } from 'lucide-react';
import { downloadSingleImage } from '../export';
import { motion } from 'motion/react';

interface GalleryProps {
  images: ImageConfig[];
  onEdit: (img: ImageConfig) => void;
  onDuplicate: (img: ImageConfig) => void;
}

export default function Gallery({ images, onEdit, onDuplicate }: GalleryProps) {
  return (
    <main className="flex-1 overflow-visible md:overflow-y-auto bg-[#F9F9F9] relative flex flex-col">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
      
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto z-10 relative w-full">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
            {images.map((img, ix) => {
               const styleCfg = RATIO_TO_DIMENSIONS[img.ratio];
               
               return (
                 <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ix * 0.05, type: "spring", stiffness: 300, damping: 30 }}
                    key={img.id} 
                    className="flex flex-col gap-3 group"
                 >
                    {/* The Canvas wrapper. Uses an aspect ratio div to keep shape predictable in UI. */}
                    <div 
                       id={`canvas-${img.id}`}
                       className={`w-full overflow-hidden relative shadow-sm border border-gray-100 rounded-lg group-hover:shadow-md transition-shadow @container cursor-pointer`}
                       style={{ 
                          backgroundColor: img.background, 
                          aspectRatio: styleCfg.w / styleCfg.h
                       }}
                       onClick={() => onEdit(img)}
                    >
                       <div 
                         className={`absolute inset-0 flex flex-col items-center justify-center`}
                         style={{
                            padding: `${(img.typography.padding / styleCfg.w) * 100}cqi`,
                         }}
                       >
                         <div
                           className={`w-full whitespace-pre-wrap break-words`}
                           style={{
                              fontFamily: `var(--${img.typography.fontFamily})`,
                              fontWeight: img.typography.fontWeight,
                              fontSize: `${(img.typography.fontSize / styleCfg.w) * 100}cqi`,
                              color: img.typography.color,
                              lineHeight: img.typography.lineHeight,
                              letterSpacing: `${(img.typography.letterSpacing / styleCfg.w) * 100}cqi`,
                              textAlign: img.typography.align,
                           }}
                         >
                            {img.text.split('\n').map((line, i, arr) => (
                               <React.Fragment key={i}>
                                  {line}
                                  {i < arr.length - 1 && <br />}
                               </React.Fragment>
                            ))}
                         </div>
                       </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="bg-white rounded-lg p-3 border border-gray-100 flex items-center justify-between opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm">
                       <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                         {img.ratio}
                       </span>
                       <div className="flex items-center gap-1">
                          <button onClick={() => onEdit(img)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded transition-colors" title="Editar">
                             <Edit2 className="w-3.5 h-3.5"/>
                          </button>
                          <button onClick={() => onDuplicate(img)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded transition-colors" title="Duplicar">
                             <Copy className="w-3.5 h-3.5"/>
                          </button>
                          <button onClick={() => downloadSingleImage(img.id)} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded transition-colors" title="Descargar">
                             <Download className="w-3.5 h-3.5"/>
                          </button>
                       </div>
                    </div>
                 </motion.div>
               );
            })}
         </div>
      </div>
    </main>
  );
}
