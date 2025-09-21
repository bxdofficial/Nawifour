import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const PhotoshopToolsParticles = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const fpsRef = useRef(60);
  const clickCountRef = useRef(0);
  const maxClicksRef = useRef(10); // الحد الأقصى للنقرات قبل البدء في الحذف
  const [reduceMotion, setReduceMotion] = useState(false);
  const { isDarkMode } = useTheme();
  const lastClickTimeRef = useRef(0);
  const autoRemovalTimerRef = useRef(null);

  // أشكال أدوات الفوتوشوب
  const PHOTOSHOP_TOOLS = {
    BRUSH: 'brush',
    ERASER: 'eraser',
    MOVE: 'move',
    MARQUEE: 'marquee',
    LASSO: 'lasso',
    WAND: 'wand',
    CROP: 'crop',
    EYEDROPPER: 'eyedropper',
    HEALING: 'healing',
    PEN: 'pen',
    TEXT: 'text',
    SHAPE: 'shape',
    HAND: 'hand',
    ZOOM: 'zoom',
    CLONE: 'clone',
    GRADIENT: 'gradient',
    BUCKET: 'bucket',
    BLUR: 'blur'
  };

  // إعدادات الأداء
  const CONFIG = {
    MAX_PARTICLES: 80, // عدد أقل للأدوات
    INITIAL_PARTICLES: 15, // عدد البارتيكلز الأولية
    PARTICLES_PER_CLICK: 3, // عدد البارتيكلز لكل نقرة
    DECAY_TIME: 8000, // 8 ثواني للاختفاء التدريجي
    MIN_FPS: 45,
    CLICK_BURST_COOLDOWN: 200,
    BASE_SIZE: 20, // حجم أكبر للأدوات
    MAX_SIZE: 35,
    BASE_SPEED: 0.3,
    MAX_SPEED: 1.5,
    REMOVAL_DELAY: 3000, // 3 ثواني قبل البدء في الحذف التدريجي
    REMOVAL_RATE: 2, // حذف 2 بارتيكل كل ثانية
  };

  // التحقق من تقليل الحركة
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const handleChange = (e) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    const savedPreference = localStorage.getItem('reduceMotion');
    if (savedPreference !== null) {
      setReduceMotion(savedPreference === 'true');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // رسم أيقونات أدوات الفوتوشوب
  const drawPhotoshopTool = (ctx, tool, x, y, size, color, opacity) => {
    ctx.save();
    ctx.globalAlpha = opacity * 0.3; // شفافية خفيفة
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    
    const scale = size / 30;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    switch (tool) {
      case PHOTOSHOP_TOOLS.BRUSH:
        // رسم فرشاة
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(-5, -5);
        ctx.lineTo(10, 10);
        ctx.lineTo(5, 15);
        ctx.lineTo(-5, 15);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.fill();
        // رأس الفرشاة
        ctx.beginPath();
        ctx.arc(-8, -8, 4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case PHOTOSHOP_TOOLS.ERASER:
        // رسم ممحاة
        ctx.fillRect(-10, -5, 20, 10);
        ctx.fillStyle = isDarkMode ? '#000000' : '#FFFFFF';
        ctx.fillRect(-8, -3, 16, 6);
        break;

      case PHOTOSHOP_TOOLS.MOVE:
        // رسم أداة التحريك (أسهم متقاطعة)
        ctx.beginPath();
        // سهم أفقي
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.moveTo(-15, 0);
        ctx.lineTo(-10, -3);
        ctx.moveTo(-15, 0);
        ctx.lineTo(-10, 3);
        ctx.moveTo(15, 0);
        ctx.lineTo(10, -3);
        ctx.moveTo(15, 0);
        ctx.lineTo(10, 3);
        // سهم عمودي
        ctx.moveTo(0, -15);
        ctx.lineTo(0, 15);
        ctx.moveTo(0, -15);
        ctx.lineTo(-3, -10);
        ctx.moveTo(0, -15);
        ctx.lineTo(3, -10);
        ctx.moveTo(0, 15);
        ctx.lineTo(-3, 10);
        ctx.moveTo(0, 15);
        ctx.lineTo(3, 10);
        ctx.stroke();
        break;

      case PHOTOSHOP_TOOLS.MARQUEE:
        // رسم أداة التحديد المستطيل
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(-10, -8, 20, 16);
        ctx.setLineDash([]);
        break;

      case PHOTOSHOP_TOOLS.LASSO:
        // رسم أداة اللاسو
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.quadraticCurveTo(10, -5, 8, 5);
        ctx.quadraticCurveTo(5, 10, -5, 10);
        ctx.quadraticCurveTo(-10, 5, -8, -5);
        ctx.quadraticCurveTo(-5, -10, 0, -10);
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
        break;

      case PHOTOSHOP_TOOLS.WAND:
        // رسم العصا السحرية
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -5);
        ctx.stroke();
        // نجمة في الأعلى
        for (let i = 0; i < 5; i++) {
          const angle = (i * 72 - 90) * Math.PI / 180;
          const x = Math.cos(angle) * 5;
          const y = Math.sin(angle) * 5 - 10;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;

      case PHOTOSHOP_TOOLS.CROP:
        // رسم أداة القص
        ctx.strokeRect(-10, -10, 20, 20);
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.lineTo(10, -5);
        ctx.moveTo(-5, -10);
        ctx.lineTo(-5, 10);
        ctx.stroke();
        break;

      case PHOTOSHOP_TOOLS.EYEDROPPER:
        // رسم القطارة
        ctx.beginPath();
        ctx.moveTo(-5, -10);
        ctx.lineTo(5, -10);
        ctx.lineTo(3, 0);
        ctx.lineTo(0, 10);
        ctx.lineTo(-3, 0);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 10, 3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case PHOTOSHOP_TOOLS.PEN:
        // رسم أداة القلم
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(3, -8);
        ctx.lineTo(2, 8);
        ctx.lineTo(0, 12);
        ctx.lineTo(-2, 8);
        ctx.lineTo(-3, -8);
        ctx.closePath();
        ctx.fill();
        // رأس القلم
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(2, -15);
        ctx.lineTo(0, -18);
        ctx.lineTo(-2, -15);
        ctx.closePath();
        ctx.fill();
        break;

      case PHOTOSHOP_TOOLS.TEXT:
        // رسم حرف T
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('T', 0, 0);
        break;

      case PHOTOSHOP_TOOLS.SHAPE:
        // رسم أشكال هندسية
        ctx.fillRect(-8, -8, 7, 7);
        ctx.beginPath();
        ctx.arc(5, 5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.lineTo(5, 8);
        ctx.lineTo(-5, 8);
        ctx.closePath();
        ctx.fill();
        break;

      case PHOTOSHOP_TOOLS.HAND:
        // رسم يد
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        // أصابع
        for (let i = -6; i <= 6; i += 3) {
          ctx.fillRect(i - 1, -10, 2, 8);
        }
        break;

      case PHOTOSHOP_TOOLS.ZOOM:
        // رسم عدسة مكبرة
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(6, 6);
        ctx.lineTo(12, 12);
        ctx.stroke();
        // علامة الزائد
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(4, 0);
        ctx.moveTo(0, -4);
        ctx.lineTo(0, 4);
        ctx.stroke();
        break;

      case PHOTOSHOP_TOOLS.CLONE:
        // رسم ختم الاستنساخ
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        // خطوط الاستنساخ
        for (let i = 0; i < 8; i++) {
          const angle = (i * 45) * Math.PI / 180;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * 5, Math.sin(angle) * 5);
          ctx.lineTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
          ctx.stroke();
        }
        break;

      case PHOTOSHOP_TOOLS.GRADIENT:
        // رسم التدرج
        const gradient = ctx.createLinearGradient(-10, 0, 10, 0);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(-10, -8, 20, 16);
        break;

      case PHOTOSHOP_TOOLS.BUCKET:
        // رسم دلو الطلاء
        ctx.beginPath();
        ctx.moveTo(-8, -5);
        ctx.lineTo(8, -5);
        ctx.lineTo(6, 8);
        ctx.lineTo(-6, 8);
        ctx.closePath();
        ctx.fill();
        // مقبض الدلو
        ctx.beginPath();
        ctx.arc(0, -5, 10, Math.PI, Math.PI * 1.5);
        ctx.stroke();
        // قطرة الطلاء
        ctx.beginPath();
        ctx.arc(10, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case PHOTOSHOP_TOOLS.BLUR:
        // رسم أداة الضبابية
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fillStyle = color + '33';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fillStyle = color + '66';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        break;

      case PHOTOSHOP_TOOLS.HEALING:
        // رسم أداة المعالجة (ضمادة)
        ctx.fillRect(-10, -3, 20, 6);
        // نقاط الضمادة
        ctx.fillStyle = isDarkMode ? '#000000' : '#FFFFFF';
        for (let i = -6; i <= 6; i += 4) {
          for (let j = -1; j <= 1; j += 2) {
            ctx.beginPath();
            ctx.arc(i, j, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;

      default:
        // شكل افتراضي
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
  };

  // فئة البارتيكل
  class PhotoshopParticle {
    constructor(x, y, isBurst = false) {
      this.x = x;
      this.y = y;
      
      // اختيار أداة عشوائية
      const tools = Object.values(PHOTOSHOP_TOOLS);
      this.tool = tools[Math.floor(Math.random() * tools.length)];
      
      this.size = Math.random() * (CONFIG.MAX_SIZE - CONFIG.BASE_SIZE) + CONFIG.BASE_SIZE;
      this.speedX = (Math.random() - 0.5) * (isBurst ? CONFIG.MAX_SPEED * 2 : CONFIG.MAX_SPEED);
      this.speedY = (Math.random() - 0.5) * (isBurst ? CONFIG.MAX_SPEED * 2 : CONFIG.MAX_SPEED);
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.05;
      this.opacity = isBurst ? 0.8 : 0.4 + Math.random() * 0.2;
      this.birthTime = Date.now();
      this.lifespan = CONFIG.DECAY_TIME + Math.random() * 2000;
      this.isBurst = isBurst;
      
      // اللون حسب الوضع
      this.color = isDarkMode 
        ? '#07ECF7' // سماوي ملكي للوضع الليلي
        : '#000000'; // أسود للوضع النهاري
    }

    update(deltaTime) {
      const age = Date.now() - this.birthTime;
      const lifePercent = Math.max(0, 1 - (age / this.lifespan));
      
      // تحديث الموقع
      this.x += this.speedX * (deltaTime / 16);
      this.y += this.speedY * (deltaTime / 16);
      
      // تحديث الدوران
      this.rotation += this.rotationSpeed * (deltaTime / 16);
      
      // تلاشي تدريجي
      this.opacity = (this.isBurst ? 0.8 : 0.4) * lifePercent;
      
      // إبطاء السرعة تدريجياً
      this.speedX *= 0.995;
      this.speedY *= 0.995;
      this.rotationSpeed *= 0.995;
      
      // حركة طفو خفيفة
      this.y += Math.sin(age * 0.001) * 0.1;
      
      return age < this.lifespan;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      drawPhotoshopTool(ctx, this.tool, 0, 0, this.size, this.color, this.opacity);
      ctx.restore();
    }
  }

  // إنشاء البارتيكلز الأولية
  const createInitialParticles = useCallback((canvas) => {
    particlesRef.current = [];
    for (let i = 0; i < CONFIG.INITIAL_PARTICLES; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particlesRef.current.push(new PhotoshopParticle(x, y, false));
    }
  }, [isDarkMode]);

  // إنتاج بارتيكل جديد
  const spawnParticle = useCallback((x, y, isBurst = false) => {
    particlesRef.current.push(new PhotoshopParticle(x, y, isBurst));
  }, [isDarkMode]);

  // بدء عملية الحذف التدريجي
  const startGradualRemoval = useCallback(() => {
    if (autoRemovalTimerRef.current) {
      clearInterval(autoRemovalTimerRef.current);
    }

    autoRemovalTimerRef.current = setInterval(() => {
      if (particlesRef.current.length > CONFIG.INITIAL_PARTICLES) {
        // حذف أقدم البارتيكلز
        const removeCount = Math.min(CONFIG.REMOVAL_RATE, 
          particlesRef.current.length - CONFIG.INITIAL_PARTICLES);
        
        for (let i = 0; i < removeCount; i++) {
          // البحث عن أقدم بارتيكل
          let oldestIndex = 0;
          let oldestTime = Date.now();
          
          particlesRef.current.forEach((particle, index) => {
            if (particle.birthTime < oldestTime) {
              oldestTime = particle.birthTime;
              oldestIndex = index;
            }
          });
          
          // حذف أقدم بارتيكل
          particlesRef.current.splice(oldestIndex, 1);
        }
        
        // إيقاف الحذف عند الوصول للعدد الأولي
        if (particlesRef.current.length <= CONFIG.INITIAL_PARTICLES) {
          clearInterval(autoRemovalTimerRef.current);
          autoRemovalTimerRef.current = null;
          clickCountRef.current = 0; // إعادة تعيين عداد النقرات
        }
      }
    }, 1000); // كل ثانية
  }, []);

  // معالج النقرة
  const handleClick = useCallback((e) => {
    if (reduceMotion) return;
    
    const now = Date.now();
    if (now - lastClickTimeRef.current < CONFIG.CLICK_BURST_COOLDOWN) {
      return;
    }
    
    lastClickTimeRef.current = now;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // زيادة عداد النقرات
    clickCountRef.current++;
    
    // إنشاء بارتيكلز جديدة
    for (let i = 0; i < CONFIG.PARTICLES_PER_CLICK; i++) {
      setTimeout(() => {
        spawnParticle(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 30, true);
      }, i * 50);
    }
    
    // إذا وصلنا للحد الأقصى، ابدأ الحذف التدريجي
    if (clickCountRef.current >= maxClicksRef.current) {
      // إلغاء أي مؤقت سابق
      if (autoRemovalTimerRef.current) {
        clearInterval(autoRemovalTimerRef.current);
      }
      
      // بدء الحذف التدريجي بعد تأخير
      setTimeout(() => {
        startGradualRemoval();
      }, CONFIG.REMOVAL_DELAY);
    }
  }, [reduceMotion, spawnParticle, startGradualRemoval]);

  // حلقة الأنيميشن
  const animate = useCallback((timestamp) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const deltaTime = timestamp - lastTimeRef.current;
    
    // حساب FPS
    fpsRef.current = 1000 / deltaTime;
    
    // تقليل البارتيكلز تلقائياً إذا انخفض FPS
    if (fpsRef.current < CONFIG.MIN_FPS && particlesRef.current.length > 30) {
      particlesRef.current = particlesRef.current.slice(0, Math.floor(particlesRef.current.length * 0.8));
    }
    
    // مسح اللوحة
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // تحديث ورسم البارتيكلز
    particlesRef.current = particlesRef.current.filter(particle => {
      const shouldKeep = particle.update(deltaTime);
      if (shouldKeep) {
        particle.draw(ctx);
      }
      return shouldKeep;
    });
    
    lastTimeRef.current = timestamp;
    
    if (!reduceMotion) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [reduceMotion]);

  // إعداد اللوحة وبدء الأنيميشن
  useEffect(() => {
    if (reduceMotion) {
      particlesRef.current = [];
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // إعادة إنشاء البارتيكلز الأولية عند تغيير الحجم
      if (particlesRef.current.length === 0) {
        createInitialParticles(canvas);
      }
    };

    handleResize();
    
    // إنشاء البارتيكلز الأولية
    createInitialParticles(canvas);
    
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('click', handleClick);

    // بدء الأنيميشن
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (autoRemovalTimerRef.current) {
        clearInterval(autoRemovalTimerRef.current);
      }
    };
  }, [animate, handleClick, reduceMotion, createInitialParticles]);

  // لا نعرض شيئاً إذا كانت الحركة مخفضة
  if (reduceMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-0 cursor-pointer"
      style={{ 
        background: isDarkMode 
          ? 'linear-gradient(135deg, #000000 0%, #0A0A0A 100%)' 
          : 'linear-gradient(135deg, #E6FDFE 0%, #D8FCFD 100%)'
      }}
      aria-label="خلفية تفاعلية بأدوات الفوتوشوب - انقر لإضافة المزيد من الأدوات"
    />
  );
};

export default PhotoshopToolsParticles;