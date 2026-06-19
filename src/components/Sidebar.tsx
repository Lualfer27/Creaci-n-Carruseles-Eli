import React from 'react';
import { AspectRatio, TypographySettings, FONTS, RATIO_TO_DIMENSIONS, ImageConfig } from '../types';
import { Settings, Image as ImageIcon, Type, LayoutTemplate, Download, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { downloadMultipleImages } from '../export';
import InstagramCopy from './InstagramCopy';

interface SidebarProps {
  text: string;
  setText: (t: string) => void;
  globalRatio: AspectRatio;
  setGlobalRatio: (r: AspectRatio) => void;
  globalTypography: TypographySettings;
  setGlobalTypography: (t: TypographySettings) => void;
  applyToAll: boolean;
  setApplyToAll: (b: boolean) => void;
  images: ImageConfig[];
}

export default function Sidebar({ text, setText, globalRatio, setGlobalRatio, globalTypography, setGlobalTypography, applyToAll, setApplyToAll, images }: SidebarProps) {
  
  const updateTypo = (key: keyof TypographySettings, value: string | number) => {
    setGlobalTypography({ ...globalTypography, [key]: value });
  };

  const handleDownloadAll = async () => {
    await downloadMultipleImages(images);
  };
  
  return (
    <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200 bg-white flex flex-col md:h-full overflow-visible md:overflow-y-auto shrink-0 shadow-sm z-20">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-display font-medium tracking-tight mb-1 flex items-center gap-2">
           <ImageIcon className="w-5 h-5 text-gray-500"/>
           Studio
        </h1>
        <p className="text-sm text-gray-500">Transforma texto en imágenes.</p>
      </div>

      <div className="flex-1 overflow-visible md:overflow-y-auto p-6 space-y-8">
        {/* TEXT INPUT */}
        <div className="space-y-3">
           <div className="flex justify-between items-center text-sm font-medium text-gray-700">
              <label className="flex items-center gap-2"><Type className="w-4 h-4"/> Contenido</label>
           </div>
           <textarea 
             className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
             placeholder="Escribe tu texto aquí...&#10;&#10;Usa -- en una línea nueva para dividir en varias imágenes."
             value={text}
             onChange={e => setText(e.target.value)}
           />
           <p className="text-xs text-gray-400">Presiona <strong>Enter</strong> para saltar renglón o dejar un párrafo vacío en la misma imagen. Escribe <strong>--</strong> en una línea nueva para dividir tu texto en múltiples imágenes.</p>
        </div>

        <InstagramCopy text={text} />

        {/* RATIO SELECTOR */}
        <div className="space-y-3">
           <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <LayoutTemplate className="w-4 h-4"/> Ratio
           </label>
           <div className="grid grid-cols-3 gap-2">
              {(Object.keys(RATIO_TO_DIMENSIONS) as AspectRatio[]).map(ratio => {
                 const cfg = RATIO_TO_DIMENSIONS[ratio];
                 const max = Math.max(cfg.w, cfg.h);
                 const w = (cfg.w / max) * 14;
                 const h = (cfg.h / max) * 14;

                 return (
                   <button 
                     key={ratio}
                     onClick={() => setGlobalRatio(ratio)}
                     className={`py-2 px-1 rounded-lg text-xs font-medium transition-colors border flex flex-col items-center justify-center gap-1.5 ${
                       globalRatio === ratio 
                         ? 'bg-black text-white border-black' 
                         : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                     }`}
                   >
                     <div className="w-4 h-4 flex items-center justify-center">
                        <div style={{ width: w, height: h }} className="border-[1.5px] border-current rounded-[2px]" />
                     </div>
                     <span className="text-[10px]">{ratio}</span>
                   </button>
                 );
              })}
           </div>
        </div>

        {/* TYPOGRAPHY */}
        <div className="space-y-4">
           <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Type className="w-4 h-4"/> Tipografía
           </label>
           <div className="space-y-3">
              <div>
                <select 
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:ring-black focus:border-black outline-none"
                  value={globalTypography.fontFamily}
                  onChange={(e) => updateTypo('fontFamily', e.target.value)}
                >
                  {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              
              <div className="flex gap-2">
                 <select 
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none"
                  value={globalTypography.fontWeight}
                  onChange={(e) => updateTypo('fontWeight', e.target.value)}
                 >
                    <option value="300">Light</option>
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="700">Bold</option>
                 </select>

                 <input 
                  type="color" 
                  className="h-10 w-16 p-1 bg-white border border-gray-200 rounded-lg cursor-pointer"
                  value={globalTypography.color}
                  onChange={(e) => updateTypo('color', e.target.value)}
                 />
              </div>

              <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
                 {(['left', 'center', 'right'] as const).map(align => (
                   <button 
                     key={align}
                     onClick={() => updateTypo('align', align)}
                     className={`flex-1 flex justify-center py-1.5 rounded-md ${globalTypography.align === align ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
                   >
                     {align === 'left' && <AlignLeft className="w-4 h-4" />}
                     {align === 'center' && <AlignCenter className="w-4 h-4" />}
                     {align === 'right' && <AlignRight className="w-4 h-4" />}
                   </button>
                 ))}
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block flex justify-between">
                  Tamaño <span>{globalTypography.fontSize}</span>
                </label>
                <input 
                  type="range" min="20" max="240" step="1"
                  className="w-full accent-black"
                  value={globalTypography.fontSize}
                  onChange={(e) => updateTypo('fontSize', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block flex justify-between">
                  Margen <span>{globalTypography.padding}</span>
                </label>
                <input 
                  type="range" min="0" max="200" step="1"
                  className="w-full accent-black"
                  value={globalTypography.padding}
                  onChange={(e) => updateTypo('padding', Number(e.target.value))}
                />
              </div>

               <div>
                <label className="text-xs text-gray-500 mb-1 block flex justify-between">
                  Espaciado (Letras) <span>{globalTypography.letterSpacing}</span>
                </label>
                <input 
                  type="range" min="-10" max="20" step="0.5"
                  className="w-full accent-black"
                  value={globalTypography.letterSpacing}
                  onChange={(e) => updateTypo('letterSpacing', Number(e.target.value))}
                />
              </div>
           </div>
        </div>

        {/* APPLY TO ALL TOGGLE */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
           <input 
             type="checkbox" 
             id="applyToAll"
             checked={applyToAll}
             onChange={e => setApplyToAll(e.target.checked)}
             className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
           />
           <label htmlFor="applyToAll" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
             Aplicar estilo a todas
           </label>
        </div>
      </div>

      <div className="p-4 md:p-6 border-t md:border-gray-100 border-gray-200 bg-white md:bg-gray-50 fixed md:static bottom-0 left-0 w-full md:w-auto z-50">
         <button onClick={handleDownloadAll} className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white p-3 rounded-xl font-medium transition-colors shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] md:shadow-sm active:scale-[0.98]">
           <Download className="w-4 h-4"/>
           Descargar todo
         </button>
      </div>

    </aside>
  )
}
