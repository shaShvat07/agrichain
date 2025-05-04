// src/components/QRCode.jsx
import React from 'react';
import { useEffect, useRef } from 'react';

// This is a simple QR code component that uses a canvas element
// In a real-world app, you'd likely use a library like qrcode.react
const QRCode = ({ value, size = 200, bgColor = '#FFFFFF', fgColor = '#000000' }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!value) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    
    // Draw a placeholder QR code (since we can't generate a real one without a library)
    // This is just for demonstration purposes
    ctx.fillStyle = fgColor;
    
    // Draw QR code frame
    ctx.fillRect(0, 0, size, 10); // Top
    ctx.fillRect(0, 0, 10, size); // Left
    ctx.fillRect(0, size - 10, size, 10); // Bottom
    ctx.fillRect(size - 10, 0, 10, size); // Right
    
    // Draw positioning squares
    // Top-left
    ctx.fillRect(20, 20, 40, 40);
    ctx.fillStyle = bgColor;
    ctx.fillRect(30, 30, 20, 20);
    ctx.fillStyle = fgColor;
    ctx.fillRect(35, 35, 10, 10);
    
    // Top-right
    ctx.fillStyle = fgColor;
    ctx.fillRect(size - 60, 20, 40, 40);
    ctx.fillStyle = bgColor;
    ctx.fillRect(size - 50, 30, 20, 20);
    ctx.fillStyle = fgColor;
    ctx.fillRect(size - 45, 35, 10, 10);
    
    // Bottom-left
    ctx.fillStyle = fgColor;
    ctx.fillRect(20, size - 60, 40, 40);
    ctx.fillStyle = bgColor;
    ctx.fillRect(30, size - 50, 20, 20);
    ctx.fillStyle = fgColor;
    ctx.fillRect(35, size - 45, 10, 10);
    
    // Draw some random modules to make it look like a QR code
    ctx.fillStyle = fgColor;
    const hash = simpleHash(value);
    const blockSize = 10;
    
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        // Skip the positioning squares
        if ((i < 5 && j < 5) || (i < 5 && j > 9) || (i > 9 && j < 5)) continue;
        
        // Use the hash to determine if this block should be filled
        if ((hash * (i + 1) * (j + 1)) % 3 === 1) {
          ctx.fillRect(
            70 + i * blockSize, 
            70 + j * blockSize, 
            blockSize, 
            blockSize
          );
        }
      }
    }
    
    // Add a small label at the bottom
    ctx.fillStyle = '#666666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scan for product history', size / 2, size - 15);
    
  }, [value, size, bgColor, fgColor]);
  
  // Very simple hash function for demo purposes
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size}
      style={{ display: 'inline-block' }}
    />
  );
};

export default QRCode;