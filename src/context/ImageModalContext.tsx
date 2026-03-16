import React, { createContext, useContext, useState, useCallback } from 'react';
import { ImageModal } from '../components/ui/ImageModal';

interface ImageModalContextType {
  openImage: (src: string, alt?: string) => void;
}

const ImageModalContext = createContext<ImageModalContextType | undefined>(undefined);

export const ImageModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const openImage = useCallback((src: string, alt?: string) => {
    setImageSrc(src);
    setImageAlt(alt || '');
    setIsOpen(true);
  }, []);

  const closeImage = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ImageModalContext.Provider value={{ openImage }}>
      {children}
      <ImageModal
        isOpen={isOpen}
        onClose={closeImage}
        src={imageSrc}
        alt={imageAlt}
      />
    </ImageModalContext.Provider>
  );
};

export const useImageModal = () => {
  const context = useContext(ImageModalContext);
  if (!context) {
    throw new Error('useImageModal must be used within an ImageModalProvider');
  }
  return context;
};
