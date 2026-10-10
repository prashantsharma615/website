/**
 * PALLAVI GUPTA — PORTFOLIO JAVASCRIPT
 * Handles mobile navigation, smooth scrolling, active states, and contact form WhatsApp hand-off.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 3. Smooth Anchor Scroll with Fixed Header Offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 4. Active Navigation Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // 5. Contact Form Submission with WhatsApp Integration
  const contactForm = document.getElementById('contactForm');
  const toastNotification = document.getElementById('toastNotification');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('senderName')?.value.trim() || '';
      const phone = document.getElementById('senderPhone')?.value.trim() || '';
      const service = document.getElementById('senderService')?.value || 'General Inquiry';
      const message = document.getElementById('senderMessage')?.value.trim() || '';

      if (!name || !phone) {
        alert('Please provide your name and contact phone number.');
        return;
      }

      // Build structured WhatsApp message
      const text = 
        `*New Website Inquiry for Pallavi Gupta*\n\n` +
        `*Client Name:* ${name}\n` +
        `*Contact Phone:* ${phone}\n` +
        `*Service Requested:* ${service}\n` +
        `*Project Details:* ${message || 'No additional notes provided.'}`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/917006181540?text=${encodedText}`;

      // Show toast confirmation
      if (toastNotification) {
        toastNotification.classList.add('show');
        setTimeout(() => {
          toastNotification.classList.remove('show');
        }, 4000);
      }

      // Open WhatsApp in new tab after brief delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        contactForm.reset();
      }, 800);
    });
  }

  console.log('Pallavi Gupta Portfolio — System initialized successfully.');
});
