import React from 'react';

interface AnimatedContainerProps {
  children: React.ReactNode;
  type?: '3d-rotate' | '3d-float' | '3d-pulse';
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ 
  children, 
  type = '3d-rotate' 
}) => {
  return (
    <div className="card neon-border rounded-xl p-8 bg-dark-card/50 backdrop-blur-sm">
      <div 
        className="aspect-square rounded-lg bg-dark relative overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div 
          className="absolute inset-0" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.05)_0%,transparent_70%)]" />
          <div className="cyber-grid absolute inset-0 opacity-10" />
        </div>
        
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {type === '3d-rotate' && (
            <div className="rotating-box">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="rotating-face"
                  style={{
                    transform: `
                      rotateX(${index * 45}deg) 
                      rotateY(${index * 45}deg) 
                      translateZ(150px)
                    `
                  }}
                />
              ))}
            </div>
          )}

          {type === '3d-float' && (
            <div 
              className="transform-gpu"
              style={{ 
                animation: 'float 3s ease-in-out infinite',
                transformStyle: 'preserve-3d'
              }}
            >
              {children}
            </div>
          )}

          {type === '3d-pulse' && (
            <div 
              className="transform-gpu"
              style={{ 
                animation: 'pulse-glow 2s ease-in-out infinite',
                transformStyle: 'preserve-3d'
              }}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};