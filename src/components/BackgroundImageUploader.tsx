
import React, { useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Upload, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BackgroundImageUploaderProps {
  type: 'background' | 'questionWindow' | 'message';
  title: string;
}

const BackgroundImageUploader: React.FC<BackgroundImageUploaderProps> = ({ type, title }) => {
  const { 
    backgroundImageUrl, 
    questionWindowImageUrl,
    customMessageImageUrl,
    setBackgroundImage,
    setQuestionWindowImage,
    setCustomMessageImage
  } = useGameStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Get the current image URL based on type
  const getCurrentImage = () => {
    switch (type) {
      case 'background':
        return backgroundImageUrl;
      case 'questionWindow':
        return questionWindowImageUrl;
      case 'message':
        return customMessageImageUrl;
      default:
        return null;
    }
  };
  
  // Handle setting the image based on type
  const handleSetImage = (url: string | null) => {
    switch (type) {
      case 'background':
        setBackgroundImage(url);
        break;
      case 'questionWindow':
        setQuestionWindowImage(url);
        break;
      case 'message':
        setCustomMessageImage(url);
        break;
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleSetImage(result);
    };
    reader.readAsDataURL(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClearImage = () => {
    handleSetImage(null);
  };
  
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      
      <div 
        className="relative rounded-lg border-2 border-dashed border-gray-300 mb-4 overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {getCurrentImage() ? (
          <div className="aspect-video relative">
            <img 
              src={getCurrentImage() || ''} 
              alt={`Custom ${type}`}
              className="w-full h-full object-cover"
            />
            {isHovering && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Button variant="destructive" onClick={handleClearImage}>
                  <X className="mr-2" size={18} />
                  Remove Image
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center p-8 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-center">Drag & drop or click to upload a background image</p>
            <p className="text-gray-400 text-sm mt-1">Recommended: 16:9 aspect ratio</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button 
          onClick={() => fileInputRef.current?.click()} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          {getCurrentImage() ? 'Change Image' : 'Upload Image'}
        </Button>
        
        {getCurrentImage() && (
          <Button 
            onClick={handleClearImage} 
            variant="outline" 
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <RefreshCw size={16} />
            Reset
          </Button>
        )}
      </div>
      
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default BackgroundImageUploader;
