/**
 * Aria Vance | Developer Portfolio Interactive JavaScript Engine
 * Optimized for performance and fluid visual aesthetics.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Core Feature & Polyfill Detection (Scroll-Driven Animations Fallback)
  // ==========================================================================
  const supportsScrollDriven = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');
  const supportsViewDriven = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

  // JavaScript fallback for Shrinking Header on Scroll (e.g. Firefox)
  if (!supportsScrollDriven) {
    const header = document.getElementById('main-header');
    
    const handleScrollNavbar = () => {
      if (window.scrollY > 80) {
        header.style.padding = '0.3rem 0';
        header.style.backgroundColor = 'rgba(4, 4, 8, 0.92)';
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      } else {
        header.style.padding = '1rem 0';
        header.style.backgroundColor = 'rgba(8, 8, 16, 0.7)';
        header.style.boxShadow = 'none';
      }
    };
    
    window.addEventListener('scroll', handleScrollNavbar, { passive: true });
    handleScrollNavbar(); // Initialize once
  }

  // JavaScript fallback for Entrance Reveal on Scroll (Intersection Observer)
  if (!supportsViewDriven) {
    // Define helper fallback CSS classes programmatically
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
      .js-reveal {
        opacity: 0;
        transform: translateY(30px) scale(0.96);
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .js-reveal.revealed {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      .js-timeline-reveal {
        opacity: 0;
        transform: translateX(-35px);
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .js-timeline-reveal.revealed {
        opacity: 1;
        transform: translateX(0);
      }
    `;
    document.head.appendChild(styleSheet);

    // Apply classes to elements
    const projectCards = document.querySelectorAll('#projects-grid > div');
    projectCards.forEach(card => card.classList.add('js-reveal'));

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => item.classList.add('js-timeline-reveal'));

    // IntersectionObserver to reveal elements
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.15
    });

    projectCards.forEach(card => revealObserver.observe(card));
    timelineItems.forEach(item => revealObserver.observe(item));
  }

  // ==========================================================================
  // 2. Interactive Typographic Carousel (Dynamic Text Highlight)
  // ==========================================================================
  const textGradientEl = document.querySelector('#hero-title .text-gradient');
  if (textGradientEl) {
    const words = ['Immersive', 'Bespoke', 'High-Performance', 'Pixel-Perfect', 'Responsive'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeAnimation = () => {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        // Deleting characters
        textGradientEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Quicker deleting
      } else {
        // Typing characters
        textGradientEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 120; // Natural writing speed
      }

      // Logic gates for loop shifts
      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at full word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500; // Pause before typing next word
      }

      setTimeout(typeAnimation, typingSpeed);
    };

    // Initiate typewriter
    setTimeout(typeAnimation, 1000);
  }

  // ==========================================================================
  // 3. Ambient Fluid Canvas Particles Background
  // ==========================================================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    let particles = [];
    const particleCount = Math.min(65, Math.floor((width * height) / 25000)); // Dynamic count based on screen density
    
    // Mouse properties
    const mouse = {
      x: null,
      y: null,
      radius: 120 // Radius of influence
    };
    
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    // Resize handler with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
      }, 200);
    });
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 1;
        this.density = Math.random() * 10 + 5;
        this.color = Math.random() > 0.5 ? 'rgba(109, 40, 217, 0.45)' : 'rgba(6, 182, 212, 0.45)'; // Violet or Cyan glow
        this.vx = Math.random() * 0.4 - 0.2;
        this.vy = Math.random() * 0.4 - 0.2;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset blur for other operations
      }
      
      update() {
        // Standard slow floating movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off canvas boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
        
        // Cursor magnetic gravity force integration
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = dx / distance;
            let directionY = dy / distance;
            
            // Attract particles slightly towards the cursor
            this.x += directionX * force * 1.5;
            this.y += directionY * force * 1.5;
          }
        }
      }
    }
    
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      requestAnimationFrame(animateParticles);
    };
    
    // Fire background engine
    initParticles();
    animateParticles();
  }

  // ==========================================================================
  // 4. Form Actions & Premium Glowing Validation Logic
  // ==========================================================================
  const form = document.getElementById('portfolio-contact-form');
  const successPanel = document.getElementById('form-success-panel');
  const resetBtn = document.getElementById('form-reset-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const inputs = form.querySelectorAll('.form-control');
      let isValid = true;

      inputs.forEach(input => {
        // Dynamic email syntax check
        if (input.type === 'email') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value)) {
            input.classList.add('is-invalid');
            isValid = false;
          } else {
            input.classList.remove('is-invalid');
          }
        } else {
          // Empty check for other inputs
          if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
          } else {
            input.classList.remove('is-invalid');
          }
        }

        // Live typing correction observer
        input.addEventListener('input', () => {
          if (input.type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailPattern.test(input.value)) {
              input.classList.remove('is-invalid');
            }
          } else {
            if (input.value.trim()) {
              input.classList.remove('is-invalid');
            }
          }
        });
      });

      // Submit gateway
      if (isValid) {
        const submitBtn = document.getElementById('form-submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Visual sending state feedback
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span> <div class="spinner-border spinner-border-sm text-light ms-2" role="status" aria-hidden="true"></div>`;

        // Simulate secure SMTP relay / API network load
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          
          // Trigger success panel view transitions
          successPanel.classList.remove('d-none');
          successPanel.style.opacity = '0';
          setTimeout(() => {
            successPanel.style.opacity = '1';
          }, 50);
          
          form.reset();
        }, 1200);
      }
    });
  }

  // Reset Contact Form from Success Interface
  if (resetBtn && successPanel) {
    resetBtn.addEventListener('click', () => {
      successPanel.style.opacity = '0';
      setTimeout(() => {
        successPanel.classList.add('d-none');
      }, 300);
    });
  }

  // ==========================================================================
  // 5. Active Link Highlighting Sync (Intersection Observer for Sections)
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  if (sections.length && navLinks.length) {
    const navObserverOptions = {
      root: null,
      threshold: 0.35, // Adjust viewport overlap ratio
      rootMargin: '-50px 0px -50px 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));
  }

  // Smooth scroll click handler (accessible target shifting)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          
          // Collapse navbar if menu is expanded on mobile targets
          const navbarCollapse = document.getElementById('navbarNav');
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const collapseToggle = document.getElementById('navbar-hamburger');
            collapseToggle.click();
          }

          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
