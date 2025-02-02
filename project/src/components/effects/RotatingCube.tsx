import React from 'react';

export const RotatingCube: React.FC = () => {
  return (
    <div className="card neon-border rounded-xl p-8 bg-dark-card/50 backdrop-blur-sm">
      <div 
        className="aspect-square rounded-lg bg-dark relative overflow-hidden rotating-container"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div 
          className="absolute inset-0" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.05)_0%,transparent_70%)]" />
          <div className="cyber-grid absolute inset-0 opacity-10" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rotating-box">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="rotating-face"
                style={{
                  transform: `
                    rotateX(${index * 45}deg) 
                    rotateY(${index * 45}deg) 
                    translateZ(${150}px)
                  `
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};