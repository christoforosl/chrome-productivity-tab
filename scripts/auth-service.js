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

  async promptForEmail() {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Welcome to Solid Focus</h5>
              </div>
              <div class="modal-body">
                <p>Please enter your email to continue:</p>
                <input type="email" id="userEmail" class="form-control" required 
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">
                <div class="invalid-feedback">
                  Please enter a valid email address
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="saveEmail">Continue</button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const emailInput = document.getElementById('userEmail');
      const saveButton = document.getElementById('saveEmail');

      const handleSave = () => {
        if (emailInput.checkValidity()) {
          const user = {
            email: emailInput.value,
            id: `local_${Date.now()}` // Generate a local ID
          };

          chrome.storage.local.set({ [this.storageKey]: user }, () => {
            document.body.removeChild(modal);
            resolve(user);
          });
        } else {
          emailInput.classList.add('is-invalid');
        }
      };

      saveButton.addEventListener('click', handleSave);
      emailInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSave();
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
