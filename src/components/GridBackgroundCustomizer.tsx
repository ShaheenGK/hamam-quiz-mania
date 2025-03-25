
import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GridBackgroundCustomizer: React.FC = () => {
  const { 
    questionWindowImageUrl, 
    setQuestionWindowImage,
    questionWindowOpacity,
    setQuestionWindowOpacity
  } = useGameStore();
  
  const [bgColor, setBgColor] = useState('#ffffff');
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setQuestionWindowImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const applyBackgroundColor = () => {
    // Create a colored background image dynamically
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 100, 100);
      const dataUrl = canvas.toDataURL('image/png');
      setQuestionWindowImage(dataUrl);
    }
  };
  
  const clearBackground = () => {
    setQuestionWindowImage(null);
  };
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Question Grid Background</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bg-image">Upload Background Image</Label>
            <Input 
              id="bg-image" 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bg-color">Or Use Color</Label>
            <div className="flex space-x-2">
              <Input 
                id="bg-color" 
                type="color" 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)}
                className="w-16"
              />
              <Button onClick={applyBackgroundColor}>Apply Color</Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Background Opacity: {questionWindowOpacity}</Label>
          <Slider 
            value={[questionWindowOpacity]} 
            min={0.1} 
            max={1} 
            step={0.05} 
            onValueChange={(values) => setQuestionWindowOpacity(values[0])}
          />
        </div>
        
        <Button variant="outline" onClick={clearBackground}>Clear Background</Button>
        
        {questionWindowImageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Current Background:</p>
            <div 
              className="h-20 w-full rounded-md bg-center bg-cover" 
              style={{ backgroundImage: `url(${questionWindowImageUrl})` }}
            ></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GridBackgroundCustomizer;
