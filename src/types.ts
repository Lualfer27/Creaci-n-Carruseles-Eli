import React from 'react';

export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9' | '3:4' | '2:3';

export interface TypographySettings {
  fontFamily: string;
  fontWeight: '300' | '400' | '500' | '700';
  fontSize: number; 
  color: string;
  lineHeight: number;
  letterSpacing: number;
  padding: number;
  align: 'left' | 'center' | 'right';
}

export interface ImageConfig {
  id: string;
  text: string;
  ratio: AspectRatio;
  background: string;
  typography: TypographySettings;
}

export const RATIO_TO_DIMENSIONS: Record<AspectRatio, { w: number, h: number, style: string, icon: React.ReactNode }> = {
  '1:1': { w: 1080, h: 1080, style: 'aspect-square', icon: null },
  '4:5': { w: 1080, h: 1350, style: 'aspect-[4/5]', icon: null },
  '9:16': { w: 1080, h: 1920, style: 'aspect-[9/16]', icon: null },
  '16:9': { w: 1920, h: 1080, style: 'aspect-[16/9]', icon: null },
  '3:4': { w: 1080, h: 1440, style: 'aspect-[3/4]', icon: null },
  '2:3': { w: 1080, h: 1620, style: 'aspect-[2/3]', icon: null },
};

export const INITIAL_PALETTE = [
  { name: 'Crema', hex: '#EBE6DF' },
  { name: 'Gris Claro', hex: '#F2F2F2' },
  { name: 'Arena', hex: '#E6E1DA' },
];

export const DEFAULT_PALETTE = [
  ...INITIAL_PALETTE,
  { name: 'Carbón', hex: '#1C1E21' },
  { name: 'Piedra', hex: '#8F9394' },
  { name: 'Salvia', hex: '#B8C2B9' },
  { name: 'Terracota', hex: '#D68C7A' },
  { name: 'Azul Polvo', hex: '#9BA8B5' },
  { name: 'Lavanda', hex: '#D3CADB' },
  { name: 'Vino', hex: '#4A2525' },
];

export const FONTS = [
  { id: 'font-cormorant', name: 'Cormorant Garamond' },
  { id: 'font-georgia', name: 'Georgia' },
  { id: 'font-sans', name: 'Inter' },
  { id: 'font-display', name: 'Space Grotesk' },
  { id: 'font-serif', name: 'Playfair Display' },
];
