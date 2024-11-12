import {showItem, hideItem} from './pageUI';
// auth-service.js

export class AuthService {
  constructor() {
    this.storageKey = 'solid_focus_user';
  }

  async getCurrentUser() {
    // Try chrome identity first
    try {
      const chromeUser = await this.getChromeIdentity();
      if (chromeUser.email) {
        return chromeUser;
      }
    } catch (error) {
      console.log('Chrome identity not available:', error);
    }

    // Fallback to stored user
    const storedUser = await this.getStoredUser();
    if (storedUser) {
      return storedUser;
    }

    // If no user is found, prompt for email
    return this.promptForEmail();
  }

  async updateUserEmail(newEmail) {
    try {
      const currentUser = await this.getStoredUser();
      if (!currentUser) {
        throw new Error('No user found to update');
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(newEmail)) {
        throw new Error('Invalid email format');
      }

      // Update user object
      const updatedUser = {
        ...currentUser,
        email: newEmail
      };

      // Save updated user
      await new Promise((resolve) => {
        chrome.storage.local.set({ [this.storageKey]: updatedUser }, resolve);
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  }

  async promptForEmail(isUpdate = false) {

    return new Promise((resolve, reject) => {

      if (! document.getElementById('divPromptForEmail')) {

        const modaldiv = document.createElement('div');

        modaldiv.innerHTML = `
          <div id="divPromptForEmail" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">${isUpdate ? 'Update Email' : 'Welcome to Solid Focus'}</h5>
                </div>
                <div class="modal-body">
                  <p>${isUpdate ? 'Enter your new email address:' : 'Please enter your email to continue:'}</p>
                  <input type="email" id="userEmail" class="form-control" required>
                  <div class="invalid-feedback">
                    Please enter a valid email address
                  </div>
                </div>
                <div class="modal-footer">
                  ${isUpdate ? '<button type="button" class="btn btn-secondary" id="cancelEmail">Cancel</button>' : ''}
                  <button type="button" class="btn btn-primary" id="saveEmail">
                    ${isUpdate ? 'Update' : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(modaldiv);
      }

      $showItem('divPromptForEmail');

      const modal = document.getElementById('divPromptForEmail');
      const emailInput = document.getElementById('userEmail');
      const saveButton = document.getElementById('saveEmail');
      const cancelButton = document.getElementById('cancelEmail');

      const handleSave = async () => {

        if (emailInput.checkValidity()) {
          const user = {
            email: emailInput.value,
            id: `local_${Date.now()}`
          };

          if (isUpdate) {
            try {
              await this.updateUserEmail(emailInput.value);
              $hideItem('divPromptForEmail');
              resolve(user);
            } catch (error) {
              console.error('Error updating email:', error);
              emailInput.classList.add('is-invalid');
              emailInput.setCustomValidity(error.message);
              emailInput.reportValidity();
            }
          } else {
            chrome.storage.local.set({ [this.storageKey]: user }, () => {
              $hideItem('divPromptForEmail');
              resolve(user);
            });
          }
        } else {
          emailInput.classList.add('is-invalid');
        }
      };

      const handleCancel = () => {
        $hideItem('divPromptForEmail');
        reject(new Error('Email update cancelled'));
      };

      saveButton.addEventListener('click', handleSave);
      if (cancelButton) {
        cancelButton.addEventListener('click', handleCancel);
      }
      emailInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSave();
        emailInput.classList.remove('is-invalid');
        emailInput.setCustomValidity('');
      });
    });
  }

  async getChromeIdentity() {
    return new Promise((resolve) => {
      if (!chrome.identity || !chrome.identity.getProfileUserInfo) {
        resolve({ email: '', id: '' });
        return;
      }

      chrome.identity.getProfileUserInfo((userInfo) => {
        resolve(userInfo);
      });
    });
  }

  async getStoredUser() {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.storageKey, (result) => {
        resolve(result[this.storageKey]);
      });
    });
  }

  async logOut() {
    return new Promise((resolve) => {

      chrome.storage.local.remove(this.storageKey, () => {
        resolve();
      });
    });
  }
}
