import React, { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

export default function InstagramCopy({ text }: { text: string }) {
  const [copyOutput, setCopyOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCopy = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Error al conectar con la API (Revisa Vercel).');
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el copy. Inténtalo de nuevo.');
      }
      
      setCopyOutput(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(copyOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 pt-4 border-t border-gray-100">
      <div className="flex justify-between items-center text-sm font-medium text-gray-700">
        <label className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-500" /> Copy para Instagram</label>
      </div>
      
      {copyOutput ? (
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl relative group">
          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{copyOutput}</p>
          
          <div className="flex justify-end gap-2 mt-3">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-50 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
            <button 
              onClick={generateCopy}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium text-purple-700 hover:bg-purple-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={generateCopy}
          disabled={isGenerating || !text.trim()}
          className="w-full flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 p-3 rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Generando...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generar Copy de Instagram</>
          )}
        </button>
      )}
      
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
