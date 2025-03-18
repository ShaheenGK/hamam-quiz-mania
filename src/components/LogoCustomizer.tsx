
import React, { useState, useRef } from 'react';
import { Upload, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';

const LogoCustomizer: React.FC = () => {
  const { logoUrl, logoText, setLogoUrl, setLogoText, logoSize, setLogoSize } = useGameStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl || null);
  const [text, setText] = useState(logoText || '');
  const [size, setSize] = useState(logoSize || 100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setPreviewUrl(result);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveLogo = () => {
    setLogoUrl(previewUrl);
    setLogoText(text);
    setLogoSize(size);
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(null);
    setLogoUrl(null);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Logo Customization</h2>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Logo Image</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1"
              >
                <Upload size={18} />
                Upload Image
              </Button>
              {previewUrl && (
                <Button
                  onClick={handleRemoveLogo}
                  variant="outline"
                  className="px-3 py-2 rounded-lg flex items-center gap-1"
                >
                  <X size={18} />
                  Remove
                </Button>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Logo Text</label>
            <Input 
              type="text" 
              placeholder="Enter logo text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Logo Size ({size}px)</label>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={handleSaveLogo}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors mt-4"
          >
            <Save size={18} />
            Save Logo Settings
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-md font-medium mb-4">Logo Preview</h3>
          <div className="flex flex-col items-center gap-2">
            {previewUrl && (
              <img src={previewUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: `${size}px` }} />
            )}
            {text && (
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontSize: `${size * 0.3}px` }}>
                {text}
              </h2>
            )}
            {!previewUrl && !text && (
              <p className="text-gray-400 italic">No logo configured</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCustomizer;
