/**
 * CraftCart User Profile & Address Book Logic
 */

let userProfile = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!api.isLoggedIn()) {
    showToast('Please sign in to access your profile.', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html?redirect=profile.html';
    }, 800);
    return;
  }

  loadProfile();
  setupProfileForms();
  setupButtonListeners();
  setupModalDismissers();
});

async function loadProfile() {
  try {
    const res = await api.get('/auth/me');
    userProfile = res.user;

    // Render basic info
    document.getElementById('profile-name').textContent = userProfile.name;
    document.getElementById('profile-email').textContent = userProfile.email;
    document.getElementById('profile-phone').textContent = userProfile.phone || 'No phone added yet';
    document.getElementById('profile-role-badge').textContent = userProfile.role === 'admin' ? 'Administrator' : 'Customer Member';
    document.getElementById('profile-avatar-letter').textContent = userProfile.name.charAt(0).toUpperCase();

    // Render addresses
    renderAddressBook(userProfile.addresses || []);
  } catch (err) {
    showToast('Failed to load profile.', 'error');
  }
}

function renderAddressBook(addresses) {
  const container = document.getElementById('profile-addresses-list');
  if (!container) return;

  if (addresses.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 2rem;">
        <p>No saved delivery addresses yet.</p>
        <button class="btn btn-primary btn-sm" onclick="openAddAddressModal()">Add Address</button>
      </div>
    `;
    return;
  }

  container.innerHTML = addresses.map(addr => `
    <div class="address-radio-card" style="cursor: default;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
        <strong style="font-size: 1rem;">${addr.label || 'Home'}</strong>
        ${addr.isDefault ? '<span class="badge badge-primary">Default</span>' : ''}
      </div>
      <p style="font-size: 0.9rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 0.85rem;">
        ${addr.street}, ${addr.city}<br>
        ${addr.state} — ${addr.postalCode}, ${addr.country}
      </p>
      <div style="display: flex; gap: 0.75rem; border-top: 1px solid var(--border-light); padding-top: 0.65rem;">
        ${!addr.isDefault ? `
          <button class="btn btn-outline btn-sm" onclick="setDefaultAddress('${addr._id}', this)">
            Set as Default
          </button>
        ` : ''}
        <button class="btn btn-secondary btn-sm" onclick="deleteAddress('${addr._id}', this)" style="color: var(--danger);">
          Delete
        </button>
      </div>
    </div>
  `).join('');
}

function setupProfileForms() {
  // Edit Profile Form
  const editProfileForm = document.getElementById('edit-profile-form');
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('edit-name').value.trim();
      const phone = document.getElementById('edit-phone').value.trim();

      try {
        const res = await api.put('/auth/profile', { name, phone });
        showToast('Profile updated successfully.', 'success');
        api.setAuth(api.getToken(), res.user);
        closeModal('edit-profile-modal');
        loadProfile();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Change Password Form
  const changePasswordForm = document.getElementById('change-password-form');
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById('curr-pass').value;
      const newPassword = document.getElementById('new-pass').value;
      const confirmPassword = document.getElementById('conf-pass').value;

      if (newPassword !== confirmPassword) {
        showToast('New passwords do not match.', 'error');
        return;
      }

      try {
        await api.put('/auth/change-password', { currentPassword, newPassword });
        showToast('Password updated successfully.', 'success');
        closeModal('change-password-modal');
        changePasswordForm.reset();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Add Address Form
  const addAddressForm = document.getElementById('add-address-form');
  if (addAddressForm) {
    addAddressForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = {
        label: document.getElementById('new-addr-label').value.trim() || 'Home',
        street: document.getElementById('new-addr-street').value.trim(),
        city: document.getElementById('new-addr-city').value.trim(),
        state: document.getElementById('new-addr-state').value.trim(),
        postalCode: document.getElementById('new-addr-postal').value.trim(),
        country: 'India',
        isDefault: document.getElementById('new-addr-default').checked
      };

      try {
        await api.post('/auth/addresses', body);
        showToast('Address added to your address book.', 'success');
        closeModal('add-address-modal');
        addAddressForm.reset();
        loadProfile();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
}

function setupButtonListeners() {
  const editBtn = document.getElementById('btn-edit-profile');
  if (editBtn) {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openEditProfileModal();
    });
  }

  const passBtn = document.getElementById('btn-change-password');
  if (passBtn) {
    passBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openChangePasswordModal();
    });
  }

  const addrBtn = document.getElementById('btn-add-address');
  if (addrBtn) {
    addrBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.openAddAddressModal();
    });
  }
}

function setupModalDismissers() {
  // Allow clicking outside the modal content (on the dark background) to close it
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('show');
      }
    });
  });
}

window.openEditProfileModal = function () {
  const current = userProfile || api.getUser();
  if (current) {
    const nameInput = document.getElementById('edit-name');
    const phoneInput = document.getElementById('edit-phone');
    if (nameInput) nameInput.value = current.name || '';
    if (phoneInput) phoneInput.value = current.phone || '';
  }
  const modal = document.getElementById('edit-profile-modal');
  if (modal) modal.classList.add('show');
};

window.openChangePasswordModal = function () {
  const modal = document.getElementById('change-password-modal');
  if (modal) modal.classList.add('show');
};

window.openAddAddressModal = function () {
  const modal = document.getElementById('add-address-modal');
  if (modal) modal.classList.add('show');
};

window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
};

window.setDefaultAddress = async function (addressId, btn) {
  try {
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Updating...';
    }
    await api.put(`/auth/addresses/${addressId}/default`);
    showToast('Default address updated.', 'success');
    await loadProfile();
  } catch (err) {
    showToast(err.message || 'Could not update default address.', 'error');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Set as Default';
    }
  }
};

window.deleteAddress = async function (addressId, btn) {
  try {
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Deleting...';
    }
    await api.delete(`/auth/addresses/${addressId}`);
    showToast('Address removed.', 'info');
    await loadProfile();
  } catch (err) {
    showToast(err.message || 'Could not delete address.', 'error');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Delete';
    }
  }
};
