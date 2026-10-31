/**
 * CraftCart Authentication Script
 * Login, Registration, Validation & One-Click Demo Credentials
 */

document.addEventListener('DOMContentLoaded', () => {
  setupLoginForm();
  setupRegisterForm();
  setupDemoButtons();
});

function setupDemoButtons() {
  const customerDemoBtn = document.getElementById('demo-customer-btn');
  const adminDemoBtn = document.getElementById('demo-admin-btn');

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  if (customerDemoBtn && emailInput && passwordInput) {
    customerDemoBtn.addEventListener('click', () => {
      emailInput.value = 'demo@craftcart.com';
      passwordInput.value = 'Customer@12345';
      showToast('Filled Customer demo credentials.', 'info');
    });
  }

  if (adminDemoBtn && emailInput && passwordInput) {
    adminDemoBtn.addEventListener('click', () => {
      emailInput.value = 'admin@craftcart.com';
      passwordInput.value = 'Admin@12345';
      showToast('Filled Admin demo credentials.', 'info');
    });
  }
}

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!email || !password) {
      showToast('Please provide both email and password.', 'warning');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Signing in...';

    try {
      const res = await api.post('/auth/login', { email, password });
      api.setAuth(res.token, res.user);

      showToast(`Welcome back, ${res.user.name}!`, 'success');

      // Determine redirect target
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect');

      setTimeout(() => {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else if (res.user.role === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 700);
    } catch (err) {
      showToast(err.message || 'Invalid credentials.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Sign In';
    }
  });
}

function setupRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const password = document.getElementById('reg-password')?.value;
    const confirmPassword = document.getElementById('reg-confirm-password')?.value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !email || !password) {
      showToast('Name, email, and password are required.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Creating Account...';

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        confirmPassword
      });

      api.setAuth(res.token, res.user);
      showToast('Account registered successfully! Welcome to CraftCart.', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Create Account';
    }
  });
}
