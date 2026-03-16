import React from 'react';
import { motion } from 'motion/react';

import { Logo } from './Logo';

export const SplashScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* Imagen de fondo con efecto de escala suave */}
      <motion.div
        layoutId="splash-image"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <img 
          src="./splash.jpg" 
          alt="Splash Background" 
          className="w-full h-full object-cover"
        />
        {/* Overlay degradado para mejorar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </motion.div>

      {/* Contenido Central */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="mb-6">
            <Logo size="xl" animate={true} />
          </div>
          <h1 className="text-6xl font-display font-bold text-white tracking-tighter mb-2">
            Novia Virtual IA
          </h1>
          <p className="text-rose-300/60 font-sans tracking-[0.4em] uppercase text-[10px] font-medium">
            Esencia Digital
          </p>
          
          {/* Barra de carga minimalista */}
          <div className="mt-12 w-32 h-[1px] bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full bg-gradient-to-r from-transparent via-rose-400 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
