// Global App Logic, API calls, and Utilities

const API_BASE = 'http://180.235.121.253:8162/'; // Same origin

// Intercept fetch to automatically route relative API calls to the backend server
const originalFetch = window.fetch;
window.fetch = async function(...args) {
    let [resource, config] = args;
    
    // Handle both string URLs and Request objects
    let url = typeof resource === 'string' ? resource : resource.url;
    
    if (typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')) {
        const fullUrl = API_BASE.replace(/\/$/, '') + url;
        if (typeof resource === 'string') {
            resource = fullUrl;
        } else {
            // For Request objects, we need to clone and override the URL
            resource = new Request(fullUrl, resource);
        }
    }
    return originalFetch(resource, config);
};

/**
 * Strict email validation matching backend rules.
 */
/**
 * Strict email validation matching backend rules.
 */
function validateEmailString(email) {
  if (!email) return { isValid: false, message: "Enter a proper mail" };
  email = email.trim().toLowerCase();

  if (email.includes(' ')) return { isValid: false, message: "Enter a proper mail" };
  const parts = email.split('@');
  if (parts.length !== 2) return { isValid: false, message: "Enter a proper mail" };

  const [local, domain] = parts;
  if (local.length < 3) return { isValid: false, message: "Enter a proper mail" };
  if (local.includes('..')) return { isValid: false, message: "Enter a proper mail" };
  if (/^\d+$/.test(local)) return { isValid: false, message: "Enter a proper mail" };
  if (!/^[a-z0-9._%+-]+$/.test(local)) return { isValid: false, message: "Enter a proper mail" };

  const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com'];
  if (!allowedDomains.includes(domain)) {
    return { isValid: false, message: "Enter a proper mail" };
  }

  return { isValid: true };
}

/**
 * Global Validation Helper for all input fields.
 * Synchronized with Android App logic and strings.
 */
const ValidationHelper = {
  rules: {
    name: {
      regex: /^[a-zA-Z\s]+$/,
      message: "Enter a valid name"
    },
    city: {
      regex: /^[a-zA-Z0-9\s,.-]+$/,
      message: "Enter a valid city or town name"
    },
    location: {
      validator: (val) => val.trim().length > 5,
      message: "Enter a valid meetup location"
    },
    email: {
      validator: validateEmailString,
      message: "Enter a proper mail"
    },
    password: {
      validator: (val) => {
        const hasCap = /[A-Z]/.test(val);
        const hasLow = /[a-z]/.test(val);
        const hasNum = /\d/.test(val);
        const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(val);
        return val.length >= 8 && hasCap && hasLow && hasNum && hasSpec;
      },
      message: "1 uppercase, lowercase, number, special and min 8 characters"
    },
    phone: {
      regex: /^\d{10}$/,
      message: "Enter a valid 10-digit phone number"
    },
    pincode: {
      regex: /^\d{6}$/,
      message: "Enter a valid 6-digit pincode"
    },
    otp: {
      regex: /^\d{4}$/,
      message: "Enter a valid 4-digit code"
    },
    offer: {
      validator: (val) => val.trim().length >= 3,
      message: "Enter what you are offering (min 3 chars)"
    },
    required: {
      validator: (val) => val.trim().length > 0,
      message: "This field is required"
    }
  },

  attach: function (inputId, type) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', () => this.validate(input, type));
    input.addEventListener('blur', () => this.validate(input, type));
  },

  validate: function (input, type) {
    const rule = this.rules[type];
    if (!rule) return true;

    const val = input.value;
    let isValid = true;
    let msg = rule.message;

    if (val === "" && type !== 'required') {
      this.hideError(input);
      return true;
    }

    if (rule.regex) {
      isValid = rule.regex.test(val);
    } else if (rule.validator) {
      const res = rule.validator(val);
      isValid = typeof res === 'object' ? res.isValid : res;
      if (typeof res === 'object' && !isValid) msg = res.message || msg;
    }

    if (isValid) {
      this.hideError(input);
    } else {
      this.showError(input, msg);
    }
    return isValid;
  },

  showError: function (input, msg) {
    let errorEl = input.parentElement.querySelector('.error-msg');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'error-msg text-[11px] font-medium text-rose-500 mt-1.5 italic ml-1';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
    input.classList.add('border-rose-400', 'bg-rose-50/10');
    input.classList.remove('border-slate-200', 'border-indigo-500');
  },

  hideError: function (input) {
    const errorEl = input.parentElement.querySelector('.error-msg');
    if (errorEl) {
      errorEl.classList.add('hidden');
    }
    input.classList.remove('border-rose-400', 'bg-rose-50/10');
    // Restore focus color if active, else default
    if (document.activeElement === input) {
      input.classList.add('border-indigo-500');
    }
  },

  /**
   * Validates all attached fields in a container/form.
   * Triggers visual errors for any invalid fields.
   */
  validateAll: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return true;

    // Find all inputs with validation rules that we might have attached
    // Note: For simplicity, we assume we know which fields to check
    // Or we can find all inputs with IDs and try to validate them
    const inputs = container.querySelectorAll('input, textarea, select');
    let allValid = true;
    let firstInvalid = null;

    inputs.forEach(input => {
      // SKIP: search bars, hidden fields (unless specified), or ignored IDs
      if (input.id?.includes('search') || input.type === 'hidden' || input.dataset.ignoreValidation) {
        return;
      }

      if (input.hasAttribute('required') && !input.value.trim()) {
        this.validate(input, 'required');
        allValid = false;
        if (!firstInvalid) firstInvalid = input;
      } else if (input.id && input.hasAttribute('required')) {
        // Only validate non-empty fields with rules, or required fields
        let type = 'required';
        if (input.id.includes('email')) type = 'email';
        else if (input.id.includes('password')) type = 'password';
        else if (input.id.includes('phone')) type = 'phone';
        else if (input.id === 'name' || input.id.includes('title')) type = 'name';
        else if (input.id.includes('city')) type = 'city';
        else if (input.id === 'location' || input.id.includes('address')) type = 'location';

        if (!this.validate(input, type)) {
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return allValid;
  }
};

// Toast Notification System
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    info:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
  };

  toast.innerHTML = `
    ${icons[type] || icons.info}
    <div style="font-weight: 500; font-size: 0.875rem; line-height: 1.4;">${message}</div>
  `;

  container.appendChild(toast);

  // Auto-dismiss with CSS exit animation
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 320);
  }, 3000);
}


/**
 * Premium Error Modal with Retry/Cancel buttons.
 */
function showErrorModal(message, retryCallback) {
  // Remove existing modal if any
  const existing = document.getElementById('error-modal-container');
  if (existing) existing.remove();

  const modalHtml = `
    <div id="error-modal-container" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <div id="error-modal" class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-8 text-center transform scale-90 opacity-0">
            <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Connection Error</h3>
            <p class="text-slate-500 mb-8 leading-relaxed">${message}</p>
            
            <div class="flex flex-col gap-3">
                <button id="error-retry-btn" class="w-full btn-premium btn-premium-indigo py-3.5 rounded-xl text-white font-bold text-sm transform transition-transform active:scale-95">
                    Retry Connection
                </button>
                <button id="error-cancel-btn" class="w-full py-3.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const container = document.getElementById('error-modal-container');
  const modal = document.getElementById('error-modal');

  // GSAP Animation
  if (window.gsap) {
    gsap.to(modal, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
  } else {
    modal.style.transform = 'scale(1)';
    modal.style.opacity = '1';
    modal.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }

  const closeModal = () => {
    if (window.gsap) {
      gsap.to(modal, { scale: 0.9, opacity: 0, duration: 0.3, onComplete: () => container.remove() });
    } else {
      container.remove();
    }
  };

  document.getElementById('error-retry-btn').onclick = () => {
    closeModal();
    if (retryCallback) retryCallback();
  };

  document.getElementById('error-cancel-btn').onclick = closeModal;
}

const AppState = {
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('currentUser'));
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  logout: async () => {
    const user = AppState.getUser();
    if (user && user.email) {
      try {
        await fetch('/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
      } catch (e) { console.error('Logout error', e); }
    }
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  },
  requireAuth: () => {
    // Disabled for debugging
  },
  getLocation: () => {
    return new Promise((resolve) => {
      // Priority: User's manually selected location during this session
      try {
        const manualLat = localStorage.getItem('localbridge_lat');
        const manualLng = localStorage.getItem('localbridge_lng');
        if (manualLat && manualLng) {
          resolve({ lat: parseFloat(manualLat), lng: parseFloat(manualLng) });
          return;
        }
      } catch (e) { }

      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  }
};

// --- Notifications System ---
function setupNotifications() {
  const user = AppState.getUser();
  if (!user) return;

  // Inject notification dropdown into DOM if missing
  let navActions = document.querySelector('.nav-actions');
  if (navActions && !document.getElementById('notifMenuBtn')) {
    // Look for the existing bell icon, or add one if it doesn't exist
    // Check if we already have a notification button to avoid duplication or removing wrong buttons
    if (document.getElementById('notifMenuBtn')) return;

    const notifMarkup = `
      <div class="relative cursor-pointer mr-4" id="notifMenuBtn">
          <button class="icon-btn" onclick="toggleNotifDropdown()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span id="notifBadge" class="hidden absolute top-0 right-0 w-2.5 h-2.5 bg-pink-500 border-2 border-white rounded-full"></span>
          </button>
          
          <div id="notifDropdown" class="hidden absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 class="font-bold text-slate-800 text-sm">Notifications</h3>
                  <button onclick="markAllRead()" class="text-xs text-indigo-600 hover:text-indigo-800 font-semibold">Mark all read</button>
              </div>
              <div id="notifList" class="max-h-80 overflow-y-auto">
                  <div class="p-4 text-center text-sm text-slate-500">No new notifications.</div>
              </div>
          </div>
      </div>
    `;
    navActions.insertAdjacentHTML('afterbegin', notifMarkup);
  }

  fetchNotifications();
  setInterval(fetchNotifications, 10000); // Poll every 10s
}

window.toggleNotifDropdown = function () {
  const drop = document.getElementById('notifDropdown');
  if (drop) drop.classList.toggle('hidden');
}

window.markAllRead = async function () {
  const user = AppState.getUser();
  if (!user) return;
  try {
    await fetch('/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email })
    });
    fetchNotifications();
  } catch (e) { }
}

async function fetchNotifications() {
  const user = AppState.getUser();
  if (!user || !user.email) return;
  try {
    const res = await fetch(`/notifications?email=${user.email}`);
    const data = await res.json();

    const badge = document.getElementById('notifBadge');
    const list = document.getElementById('notifList');

    if (!badge || !list) return;

    if (data.length > 0) {
      if (typeof window.lastNotifCount !== 'undefined' && data.length > window.lastNotifCount) {
        showToast('New notification: ' + data[0].message, 'info');
      }
      window.lastNotifCount = data.length;

      badge.classList.remove('hidden');

      const matchesNav = document.querySelector('a[href="/matches"]');
      if (matchesNav && !document.getElementById('matchesNavDot')) {
        matchesNav.insertAdjacentHTML('beforeend', '<span id="matchesNavDot" class="w-2.5 h-2.5 bg-pink-500 rounded-full ml-auto shadow-sm"></span>');
      }

      list.innerHTML = data.map(n => {
        let icon = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="text-indigo-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        if (n.type === 'accepted') icon = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';

        let dest = n.related_id ? `/product/0?match_id=${n.related_id}` : '#';

        return `
              <a href="${dest}" class="flex items-start gap-3 p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors">
                  <div class="mt-0.5">${icon}</div>
                  <div class="flex-grow">
                      <p class="text-sm text-slate-800 leading-tight">${n.message}</p>
                      <p class="text-xs text-slate-400 mt-1">${new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
              </a>
          `}).join('');
    } else {
      window.lastNotifCount = 0;
      badge.classList.add('hidden');
      const checkDot = document.getElementById('matchesNavDot');
      if (checkDot) checkDot.remove();
      list.innerHTML = '<div class="p-4 text-center text-sm text-slate-500">No new notifications.</div>';
    }
  } catch (e) { }
}


// --- Global Image Zoom Feature ---
function initImageZoom() {
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'IMG' && !target.classList.contains('no-zoom')) {
      // Filter out small icons or specific avatars if needed
      if (target.offsetWidth < 32 || target.src.includes('avatar') || target.src.includes('icon')) {
        // If it's a small icon or avatar, we might want to skip, 
        // but let's allow avatars if they are part of a profile view.
        // For now, let's just ignore if tiny.
        if (target.offsetWidth < 32) return;
      }

      openImageZoom(target);
    }
  });
}

function openImageZoom(img) {
  // Prevent dual modals
  if (document.querySelector('.image-zoom-overlay')) return;

  const src = img.src;
  const rect = img.getBoundingClientRect();

  const overlay = document.createElement('div');
  overlay.className = 'image-zoom-overlay';

  overlay.innerHTML = `
        <div class="image-zoom-wrapper">
            <div class="image-zoom-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>
            <img src="${src}" class="image-zoom-img">
        </div>
    `;

  document.body.appendChild(overlay);
  const zoomedImg = overlay.querySelector('.image-zoom-img');
  const closeBtn = overlay.querySelector('.image-zoom-close');

  // Lock scroll
  document.body.style.overflow = 'hidden';

  // GSAP Animation: Grow from source
  if (window.gsap) {
    gsap.set(overlay, { opacity: 0 });
    gsap.set(zoomedImg, {
      x: rect.left + (rect.width / 2) - (window.innerWidth / 2),
      y: rect.top + (rect.height / 2) - (window.innerHeight / 2),
      scale: rect.width / window.innerWidth,
      opacity: 0,
      borderRadius: '1rem'
    });

    gsap.to(overlay, { opacity: 1, duration: 0.3 });
    gsap.to(zoomedImg, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      borderRadius: '1.5rem'
    });
  }

  const close = () => {
    document.body.style.overflow = '';
    if (window.gsap) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => overlay.remove()
      });
      gsap.to(zoomedImg, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3
      });
    } else {
      overlay.remove();
    }
  };

  overlay.onclick = (e) => { if (e.target === overlay || e.target.classList.contains('image-zoom-wrapper')) close(); };
  closeBtn.onclick = close;

  // Escape key support
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

document.addEventListener("DOMContentLoaded", () => {
  setupNotifications();
  initImageZoom();
});

// Helper for generic API forms
async function submitApiForm(formElement, url, method = 'POST') {
  const btn = formElement.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = `<span class="animate-pulse">Loading...</span>`;
  btn.disabled = true;

  try {
    const isMultipart = formElement.enctype === 'multipart/form-data';
    const fetchOptions = {
      method: method
    };

    if (isMultipart) {
      fetchOptions.body = new FormData(formElement);
    } else {
      const data = Object.fromEntries(new FormData(formElement).entries());
      fetchOptions.headers = { 'Content-Type': 'application/json' };
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
    throw new Error('Network error occurred.');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}
