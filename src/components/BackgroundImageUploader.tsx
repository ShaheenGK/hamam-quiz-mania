
import React, { useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Upload, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

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
    setCustomMessageImage,
    backgroundOpacity,
    setBackgroundOpacity,
    backgroundSize,
    setBackgroundSize,
    backgroundPositionX,
    setBackgroundPositionX,
    backgroundPositionY,
    setBackgroundPositionY,
    questionWindowOpacity,
    setQuestionWindowOpacity,
    questionWindowSize,
    setQuestionWindowSize,
    questionWindowPositionX,
    setQuestionWindowPositionX,
    questionWindowPositionY,
    setQuestionWindowPositionY,
    customMessageOpacity,
    setCustomMessageOpacity,
    customMessageSize,
    setCustomMessageSize,
    customMessagePositionX,
    setCustomMessagePositionX,
    customMessagePositionY,
    setCustomMessagePositionY
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
  
  // Get the current opacity based on type
  const getCurrentOpacity = () => {
    switch (type) {
      case 'background':
        return backgroundOpacity;
      case 'questionWindow':
        return questionWindowOpacity;
      case 'message':
        return customMessageOpacity;
      default:
        return 0.85;
    }
  };
  
  // Handle setting the opacity based on type
  const handleSetOpacity = (value: number) => {
    switch (type) {
      case 'background':
        setBackgroundOpacity(value);
        break;
      case 'questionWindow':
        setQuestionWindowOpacity(value);
        break;
      case 'message':
        setCustomMessageOpacity(value);
        break;
    }
  };
  
  // Get the current size based on type
  const getCurrentSize = () => {
    switch (type) {
      case 'background':
        return backgroundSize;
      case 'questionWindow':
        return questionWindowSize;
      case 'message':
        return customMessageSize;
      default:
        return 100;
    }
  };
  
  // Handle setting the size based on type
  const handleSetSize = (value: number) => {
    switch (type) {
      case 'background':
        setBackgroundSize(value);
        break;
      case 'questionWindow':
        setQuestionWindowSize(value);
        break;
      case 'message':
        setCustomMessageSize(value);
        break;
    }
  };
  
  // Get the current position X based on type
  const getCurrentPositionX = () => {
    switch (type) {
      case 'background':
        return backgroundPositionX;
      case 'questionWindow':
        return questionWindowPositionX;
      case 'message':
        return customMessagePositionX;
      default:
        return 50;
    }
  };
  
  // Handle setting the position X based on type
  const handleSetPositionX = (value: number) => {
    switch (type) {
      case 'background':
        setBackgroundPositionX(value);
        break;
      case 'questionWindow':
        setQuestionWindowPositionX(value);
        break;
      case 'message':
        setCustomMessagePositionX(value);
        break;
    }
  };
  
  // Get the current position Y based on type
  const getCurrentPositionY = () => {
    switch (type) {
      case 'background':
        return backgroundPositionY;
      case 'questionWindow':
        return questionWindowPositionY;
      case 'message':
        return customMessagePositionY;
      default:
        return 50;
    }
  };
  
  // Handle setting the position Y based on type
  const handleSetPositionY = (value: number) => {
    switch (type) {
      case 'background':
        setBackgroundPositionY(value);
        break;
      case 'questionWindow':
        setQuestionWindowPositionY(value);
        break;
      case 'message':
        setCustomMessagePositionY(value);
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
              style={{
                opacity: getCurrentOpacity(),
                objectFit: 'cover',
                objectPosition: `${getCurrentPositionX()}% ${getCurrentPositionY()}%`
              }}
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
      
      {getCurrentImage() && (
        <div className="space-y-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Opacity: {Math.round(getCurrentOpacity() * 100)}%</Label>
            </div>
            <Slider 
              value={[getCurrentOpacity() * 100]} 
              min={0} 
              max={100} 
              step={1}
              onValueChange={(value) => handleSetOpacity(value[0] / 100)} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Size: {getCurrentSize()}%</Label>
            </div>
            <Slider 
              value={[getCurrentSize()]} 
              min={50} 
              max={200} 
              step={5}
              onValueChange={(value) => handleSetSize(value[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Position X: {getCurrentPositionX()}%</Label>
            </div>
            <Slider 
              value={[getCurrentPositionX()]} 
              min={0} 
              max={100} 
              step={1}
              onValueChange={(value) => handleSetPositionX(value[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Position Y: {getCurrentPositionY()}%</Label>
            </div>
            <Slider 
              value={[getCurrentPositionY()]} 
              min={0} 
              max={100} 
              step={1}
              onValueChange={(value) => handleSetPositionY(value[0])} 
            />
          </div>
        </div>
      )}
      
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
