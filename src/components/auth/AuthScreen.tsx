import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { AuthExtraContent } from './AuthExtraContent';

export const AuthScreen = () => {
  const { login, register, resendConfirmationEmail, resetPasswordEmail, updatePassword, recoveryMode } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        const result = await register({ email, password });
        if (result && (result as any).needsConfirmation) {
          setNeedsConfirmation(true);
        }
        // Si no necesita confirmación, el AuthContext ya habrá hecho el login
        // y el estado de la app cambiará automáticamente
      }
    } catch (err: any) {
      let errorMessage = err.message || 'Ocurrió un error';
      if (isLogin && (errorMessage.includes('Invalid login credentials') || errorMessage.includes('invalid_credentials'))) {
        errorMessage = 'Credenciales inválidas. Si es tu primera vez en este nuevo servidor, por favor usa la pestaña "Registrarse" para crear tu cuenta.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setResendSuccess(false);
    try {
      await resendConfirmationEmail(email);
      setResendSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al reenviar el correo');
    } finally {
      setResending(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetSuccess(false);
    try {
      await resetPasswordEmail(email);
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    try {
      await updatePassword(password);
      setUpdateSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Mobile Background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="./splash.jpg" 
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 sm:p-12 text-center border border-white z-10"
        >
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Mail size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">¡Casi listo!</h2>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Hemos enviado un enlace a <span className="font-bold text-slate-900">{email}</span>. 
            Activa tu cuenta para empezar.
          </p>

          <div className="space-y-4 mb-8">
            <Button 
              onClick={() => {
                setNeedsConfirmation(false);
                setIsLogin(true);
              }}
              className="w-full py-4.5 rounded-[1.5rem] text-lg font-bold"
            >
              Volver al inicio
            </Button>
            
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-bold text-rose-600 hover:text-rose-700 disabled:opacity-50 transition-colors uppercase tracking-widest"
            >
              {resending ? 'REENVIANDO...' : 'REENVIAR ENLACE'}
            </button>
          </div>

          {resendSuccess && (
            <p className="text-rose-600 text-xs font-bold bg-rose-50 py-3 rounded-2xl border border-rose-100">
              ¡ENLACE REENVIADO CON ÉXITO!
            </p>
          )}
          
          {error && (
            <p className="text-rose-500 text-xs font-bold bg-rose-50 py-3 rounded-2xl border border-rose-100 mt-2">
              {error.toUpperCase()}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  if (recoveryMode) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Mobile Background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="./splash.jpg" 
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-white z-10"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock size={36} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Nueva contraseña</h2>
            <p className="text-slate-500 mt-3 text-lg leading-relaxed">Ingresa tu nueva contraseña para recuperar el acceso.</p>
          </div>

          {updateSuccess ? (
            <div className="text-center">
              <div className="bg-rose-50 text-rose-600 p-6 rounded-[1.5rem] border border-rose-100 mb-8 font-medium">
                ¡Contraseña actualizada con éxito!
              </div>
              <Button 
                onClick={() => window.location.reload()}
                className="w-full py-4.5 rounded-[1.5rem] text-lg font-bold"
              >
                Ir al inicio
              </Button>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Nueva contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] focus:ring-0 focus:border-rose-600/20 transition-all placeholder:text-slate-300 text-slate-900 shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Confirmar nueva contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-4 bg-white border-2 border-slate-100 rounded-[1.5rem] focus:ring-0 focus:border-rose-600/20 transition-all placeholder:text-slate-300 text-slate-900 shadow-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-rose-500 text-xs font-bold text-center bg-rose-50 py-3 rounded-2xl border border-rose-100">
                  {error.toUpperCase()}
                </p>
              )}

              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-4.5 rounded-[1.5rem] text-lg font-bold"
              >
                Actualizar contraseña
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
        {/* Professional Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="./splash.jpg" 
            alt=""
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-white/10 z-10"
        >
          <div className="text-center mb-8">
            <Logo size="lg" animate={true} className="mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white tracking-tight">Recuperar acceso</h2>
            <p className="text-slate-300 mt-3 text-lg leading-relaxed">Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
          </div>

          {resetSuccess ? (
            <div className="text-center">
              <div className="bg-rose-500/10 text-rose-400 p-6 rounded-[1.5rem] border border-rose-500/20 mb-8 font-medium">
                ¡Correo enviado! Revisa tu bandeja de entrada.
              </div>
              <Button 
                onClick={() => setIsForgotPassword(false)}
                className="w-full py-4.5 rounded-[1.5rem] text-lg font-bold"
              >
                Volver al inicio
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] ml-1">Correo electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-400 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    className="w-full pl-14 pr-5 py-4 bg-white/10 border-2 border-white/10 rounded-[1.5rem] focus:ring-0 focus:border-rose-500/30 transition-all placeholder:text-slate-500 text-white shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="text-rose-400 text-xs font-bold text-center bg-rose-500/10 py-3 rounded-2xl border border-rose-500/20">
                  {error.toUpperCase()}
                </p>
              )}

              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-4.5 rounded-[1.5rem] text-lg font-bold"
              >
                Enviar enlace
              </Button>

              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full text-center text-sm font-bold text-slate-400 hover:text-white transition-colors py-2 uppercase tracking-widest"
              >
                Cancelar
              </button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden relative bg-slate-950">
      {/* Mobile Background - Permanente y visible */}
      <div className="lg:hidden fixed inset-0 z-0">
        <img 
          src="./splash.jpg" 
          alt=""
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Capa de contraste para asegurar legibilidad del formulario */}
        <div className="absolute inset-0 bg-slate-950/50" />
      </div>

      {/* Left Side - Visual/Atmospheric (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        <motion.div 
          layoutId="splash-image"
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="./splash.jpg" 
            alt="Atmospheric background"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full pointer-events-none">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 0.4 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-3"
          >
            <Logo size="md" withGlint={false} />
            <span className="text-2xl font-bold text-white tracking-tight">Novia Virtual IA</span>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-end justify-center p-4 sm:p-8 lg:p-12 lg:pb-16 z-10 overflow-y-auto lg:overflow-hidden lg:h-full">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full flex flex-col justify-end lg:p-0 pb-2 sm:pb-0 lg:max-h-[85vh]"
        >
          {/* Logo & Brand */}
          <div className="flex flex-col items-center mb-4 sm:mb-8 lg:mb-4">
            <Logo size="lg" animate={true} className="mb-2" />
            <h1 className="text-2xl sm:text-4xl lg:text-3xl font-bold text-white tracking-tight drop-shadow-md">
              Novia Virtual IA
            </h1>
          </div>

          <div className="mb-3 sm:mb-10 lg:mb-4 text-center">
            <p className="text-white/90 text-sm sm:text-lg drop-shadow-sm leading-tight">
              {isLogin 
                ? 'Bienvenido de nuevo. Tu refugio digital te espera.' 
                : 'Únete a una comunidad de esencia única, diseñada para inspirar y cultivar vínculos genuinos.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-5 lg:gap-3">
            <div className="space-y-1 sm:space-y-2">
              <label className="text-[10px] font-bold text-white uppercase tracking-[0.2em] ml-1 drop-shadow-sm">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-2.5 sm:py-4 lg:py-3 bg-white/35 backdrop-blur-md border-2 border-white/20 rounded-[1.25rem] sm:rounded-[1.5rem] focus:ring-0 focus:border-rose-600/20 focus:bg-white transition-all placeholder:text-slate-300 text-slate-900 text-xl sm:text-2xl lg:text-xl shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-white uppercase tracking-[0.2em] drop-shadow-sm">Contraseña</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    ¿OLVIDASTE?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-2.5 sm:py-4 lg:py-3 bg-white/35 backdrop-blur-md border-2 border-white/20 rounded-[1.25rem] sm:rounded-[1.5rem] focus:ring-0 focus:border-rose-600/20 focus:bg-white transition-all placeholder:text-slate-300 text-slate-900 text-xl sm:text-2xl lg:text-xl shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="space-y-1 sm:space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-bold text-white uppercase tracking-[0.2em] ml-1 drop-shadow-sm">Confirmar Contraseña</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={18} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required={!isLogin}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-2.5 sm:py-4 lg:py-3 bg-white/35 backdrop-blur-md border-2 border-white/20 rounded-[1.25rem] sm:rounded-[1.5rem] focus:ring-0 focus:border-rose-600/20 focus:bg-white transition-all placeholder:text-slate-300 text-slate-900 text-xl sm:text-2xl lg:text-xl shadow-sm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-rose-50 border border-rose-100 rounded-xl"
              >
                <p className="text-rose-600 text-[10px] font-medium text-center">
                  {error}
                </p>
              </motion.div>
            )}

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-3 sm:py-4.5 lg:py-3.5 rounded-[1.25rem] sm:rounded-[1.5rem] mt-2 sm:mt-4 lg:mt-2 text-base sm:text-lg font-bold transition-all transform active:scale-[0.98]"
              leftIcon={isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            >
              {isLogin ? 'Entrar' : 'Registrarme'}
            </Button>
          </form>

          <div className="mt-4 sm:mt-10 lg:mt-4 text-center">
            <p className="text-white font-bold text-xs drop-shadow-md flex items-center justify-center gap-2">
              <span>{isLogin ? '¿Aún no eres parte?' : '¿Ya tienes una cuenta?'}</span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-rose-400 hover:text-rose-300 transition-colors underline underline-offset-4 text-base"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>

            {/* Espacio modular y escalable para futuras integraciones */}
            <AuthExtraContent />
          </div>

          <div className="mt-4 sm:mt-12 lg:mt-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white drop-shadow-sm">
              Novia Virtual IA by Nexo Network Ec.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

