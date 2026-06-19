import React, { useState } from 'react';
import { ImageConfig, AspectRatio, TypographySettings, RATIO_TO_DIMENSIONS, FONTS, DEFAULT_PALETTE } from '../types';
import { X, Type, LayoutTemplate, Palette, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { motion } from 'motion/react';

interface EditModalProps {
  image: ImageConfig;
  onClose: () => void;
  onUpdate: (img: ImageConfig) => void;
}

export default function EditModal({ image, onClose, onUpdate }: EditModalProps) {
  const [localImage, setLocalImage] = useState<ImageConfig>({ ...image });

  const updateTypo = (key: keyof TypographySettings, value: string | number) => {
    const updated = {
      ...localImage, 
      typography: { ...localImage.typography, [key]: value }
    };
    setLocalImage(updated);
    onUpdate(updated);
  };

  const updateRatio = (r: AspectRatio) => {
    const updated = { ...localImage, ratio: r };
    setLocalImage(updated);
    onUpdate(updated);
  };

  const updateBg = (c: string) => {
    const updated = { ...localImage, background: c };
    setLocalImage(updated);
    onUpdate(updated);
  }
  
  const updateText = (t: string) => {
    const updated = { ...localImage, text: t };
    setLocalImage(updated);
    onUpdate(updated);
  }

  const styleCfg = RATIO_TO_DIMENSIONS[localImage.ratio];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 0.95 }}
         className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-5xl w-full h-[90vh] flex overflow-hidden relative"
       >
          <button onClick={onClose} className="absolute right-4 top-4 z-10 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-white text-gray-500 hover:text-black">
             <X className="w-5 h-5"/>
          </button>
          
          {/* Editor Sidebar */}
          <div className="w-80 border-r border-gray-100 bg-gray-50 p-6 flex flex-col gap-8 overflow-y-auto shrink-0">
             <div>
                <h2 className="text-xl font-display font-medium mb-1">Editor Individual</h2>
                <p className="text-xs text-gray-500">Editando estilo independiente.</p>
             </div>

             <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2"><Type className="w-4 h-4"/> Texto</label>
                <textarea 
                  className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-black outline-none"
                  value={localImage.text}
                  onChange={e => updateText(e.target.value)}
                />
             </div>

             {/* Background Palette */}
             <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2"><Palette className="w-4 h-4"/> Fondo</label>
                <div className="flex gap-2 flex-wrap">
                   {DEFAULT_PALETTE.map(c => (
                     <button
                        key={c.hex}
                        onClick={() => updateBg(c.hex)}
                        className={`w-8 h-8 rounded-full border-2 ${localImage.background === c.hex ? 'border-black' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }}
                     />
                   ))}
                   <input type="color" value={localImage.background} onChange={e => updateBg(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer p-0 border-0 outline-none" />
                </div>
             </div>

             {/* Local Ratio */}
             <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2"><LayoutTemplate className="w-4 h-4"/> Formato</label>
                <div className="grid grid-cols-3 gap-2">
                   {(Object.keys(RATIO_TO_DIMENSIONS) as AspectRatio[]).map(ratio => {
                     const cfg = RATIO_TO_DIMENSIONS[ratio];
                     const max = Math.max(cfg.w, cfg.h);
                     const w = (cfg.w / max) * 14;
                     const h = (cfg.h / max) * 14;
    
                     return (
                       <button 
                         key={ratio}
                         onClick={() => updateRatio(ratio)}
                         className={`py-1.5 px-1 rounded-md text-xs font-medium border flex flex-col items-center justify-center gap-1.5 ${
                           localImage.ratio === ratio 
                             ? 'bg-black text-white border-black' 
                             : 'bg-white text-gray-600 hover:bg-gray-100'
                         }`}
                       >
                         <div className="w-4 h-4 flex items-center justify-center">
                            <div style={{ width: w, height: h }} className="border-[1.5px] border-current rounded-[2px]" />
                         </div>
                         <span>{ratio}</span>
                       </button>
                     );
                   })}
                </div>
             </div>

             {/* Local Typography */}
             <div className="space-y-3">
                <label className="text-sm font-medium">Tipografía</label>
                <select 
                  className="w-full text-sm bg-white border border-gray-200 rounded-md p-2 outline-none"
                  value={localImage.typography.fontFamily}
                  onChange={(e) => updateTypo('fontFamily', e.target.value)}
                >
                  {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>

                <div className="flex gap-2">
                   <select 
                     className="w-full text-sm bg-white border border-gray-200 rounded-md p-2 outline-none"
                     value={localImage.typography.fontWeight}
                     onChange={(e) => updateTypo('fontWeight', e.target.value)}
                   >
                      <option value="300">Light</option>
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="700">Bold</option>
                   </select>
                   <input 
                    type="color" 
                    className="h-9 w-16 p-1 bg-white border border-gray-200 rounded-md cursor-pointer outline-none"
                    value={localImage.typography.color}
                    onChange={(e) => updateTypo('color', e.target.value)}
                   />
                </div>

                <div className="flex bg-white border border-gray-200 rounded-md p-1">
                   {(['left', 'center', 'right'] as const).map(align => (
                     <button 
                       key={align}
                       onClick={() => updateTypo('align', align)}
                       className={`flex-1 flex justify-center py-1.5 rounded-md ${localImage.typography.align === align ? 'bg-gray-100 shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                     >
                       {align === 'left' && <AlignLeft className="w-4 h-4" />}
                       {align === 'center' && <AlignCenter className="w-4 h-4" />}
                       {align === 'right' && <AlignRight className="w-4 h-4" />}
                     </button>
                   ))}
                </div>

                <div className="pt-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Tamaño</label>
                  <input type="range" min="20" max="240" step="1" className="w-full accent-black"
                    value={localImage.typography.fontSize}
                    onChange={(e) => updateTypo('fontSize', Number(e.target.value))}
                  />
                </div>

                 <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Margen</label>
                  <input type="range" min="0" max="200" step="1" className="w-full accent-black"
                    value={localImage.typography.padding}
                    onChange={(e) => updateTypo('padding', Number(e.target.value))}
                  />
                </div>
                 
                 <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Espaciado</label>
                  <input type="range" min="-10" max="20" step="0.5" className="w-full accent-black"
                    value={localImage.typography.letterSpacing}
                    onChange={(e) => updateTypo('letterSpacing', Number(e.target.value))}
                  />
                </div>
             </div>

          </div>

          {/* Preview canvas */}
          <div className="flex-1 bg-gray-100/50 p-8 flex items-center justify-center overflow-hidden">
             {/* We want it as big as possible within the container, keeping aspect ratio */}
             <div 
               className="relative shadow-2xl overflow-hidden transition-all duration-300 rounded-lg flex-shrink-0"
               style={{
                  height: '100%',
                  aspectRatio: styleCfg.w / styleCfg.h,
                  backgroundColor: localImage.background
               }}
             >
                 {/* Inner scaler */}
                 <div 
                   className="absolute top-0 left-0 origin-top-left flex items-center justify-center p-12"
                   style={{ 
                     width: styleCfg.w, 
                     height: styleCfg.h,
                     /* We want this wrapper to scale such that it matches the parent's height 100%. 
                        Since the parent's height is exactly 100% of the container: 
                        Wait, we can't easily compute the exact scale via pure CSS without knowing pixel sizes.
                        Hack: Container width is 100%, so we can scale based on container width.
                        If the parent has a fluid width determined by aspectRatio and height 100%, 
                        we can use `container type: size` or CQ units. But let's keep it simple: 
                        We will use the same technique. Instead of `w-full`, this element is fixed aspect ratio.
                        We can use `transform: scale(cqi)` if we set container query.
                      */
                   }}
                 >
                    {/* Wait, the Gallery component simply does `transform: scale(calc(100% / styleCfg.w))`.
                        Wait, percentage in `scale()` is not valid CSS! 
                        Wait, `scale(calc(100% / width))` doesn't work. `100%` in calc for scale is not the parent width.
                        Let me fix this.
                        We need to use CQI or resize observer.
                     */}
                     {/* Temporarily fallback to simple CSS scaling. */}
                 </div>
                 {/* For the modal preview, let's use standard relative styling, but wait, the px won't match export precisely. 
                     We should use `container-type: inline-size` for true fluid typography.
                     But if users define font-size in pixels (20px-200px), it means those pixels must map to the 1080x1350 canvas.
                     I'll inject an inline style here that scales it accurately.
                 */}
                 <div
                   id={`modal-canvas`}
                   style={{ width: '100%', height: '100%', position: 'relative' }}
                   className="@container"
                 >
                    <div 
                        className={`absolute inset-0 flex flex-col items-center justify-center`}
                        style={{
                           padding: `${(localImage.typography.padding / styleCfg.w) * 100}cqi`,
                        }}
                     >
                        <div 
                           className={`w-full whitespace-pre-wrap break-words`}
                           style={{
                              fontFamily: `var(--${localImage.typography.fontFamily})`, // Tailwind custom props
                              fontWeight: localImage.typography.fontWeight,
                              // map the px value relative to 1080px width:
                              // 100px on 1080px is ~9.25cqi.
                              fontSize: `${(localImage.typography.fontSize / styleCfg.w) * 100}cqi`,
                              color: localImage.typography.color,
                              lineHeight: localImage.typography.lineHeight,
                              letterSpacing: `${(localImage.typography.letterSpacing / styleCfg.w) * 100}cqi`,
                              textAlign: localImage.typography.align,
                           }}
                        >
                           {localImage.text.split('\n').map((line, i, arr) => (
                              <React.Fragment key={i}>
                                 {line}
                                 {i < arr.length - 1 && <br />}
                              </React.Fragment>
                           ))}
                        </div>
                     </div>
                 </div>
             </div>
          </div>
       </motion.div>
    </div>
  )
}
