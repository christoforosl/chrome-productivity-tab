import { settings, options, $html, $e } from "./common.js";
import { checkForActiveFocusTimer,setCurrentFocusAndStartTimer } from "./newTab.js";
import { setQuote } from "./getQuote.js";
import { checkBackroundImageOnLoad, fetchImageFromApiService } from "./backgroundImage.js";
import { AuthService } from './auth-service.js';

const authService = new AuthService();
let curentDateTimeTimer = null;

function setCurrentDateTimeTimer() {
    curentDateTimeTimer = setInterval(setCurrentDateTime, 1000);
}

chrome.tabs.onRemoved.addListener(function () {
  if (curentDateTimeTimer) {
    console.log("Clearing Interval");
    clearInterval(curentDateTimeTimer);
  }
});

function loadSettings() {

    if (Object.keys(settings).length === 0) {
        const parsed = JSON.parse(window.localStorage.getItem("settings")) || { imageKeywords: "nature" };
        Object.keys(parsed).forEach((k) => (settings[k] = parsed[k]));
    }
}

function setCurrentDateTime() {
    const d = new Date();
    const centeredText = d.toDateString() + ", " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    let greeting;

    if (d.getHours() > 0 && d.getHours() <= 12) {
        greeting = "Good Morning, ";
    } else if (d.getHours() > 12 && d.getHours() <= 19) {
        greeting = "Good Afternoon, ";
    } else {
        greeting = "Good Evening, ";
    }
    greeting = greeting + (settings.greetingName || "[Specify Name In Settings]");
    $html("btnSetWorkItem", options.whatShallWeWorkOnQuestionText);
    $html("currentTime", `${centeredText}<br>Solid Focus, version ${options.version}`);
    $html("greeting", greeting);
}

$(document).ready(() => {
    loadSettings();
    authService.getCurrentUser().then(function (userInfo) {

        if (userInfo.email) {
            options.profileUserEmail = userInfo.email;
            options.profileUserId = userInfo.id;

            checkBackroundImageOnLoad();
            checkForActiveFocusTimer();
            setCurrentDateTimeTimer();
            setQuote();

            if ($e("btnSetCurrentFocusAndStartTimer")) {
                $e("btnSetCurrentFocusAndStartTimer").addEventListener("click", setCurrentFocusAndStartTimer);

                $e("frmEnterTaskName").addEventListener(
                    "submit",
                    function (event) {
                        if ($e("frmEnterTaskName").checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add("was-validated");
                    },
                    false
                );
            }
            if ($e("btnShowSettings")) {
                $("#backroundImageSearchTerms").val(settings.imageKeywords);
                $("#greetingName").val(settings.greetingName);
            }

            if ($e("btnChangeWallpaper")) {
                $e("btnChangeWallpaper").addEventListener("click", function () {
                    localStorage.removeItem("currentBackroundImage");
                    fetchImageFromApiService();
                });
            }
        } else {
            console.log("User info not available");
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icon16.png',
                title: 'Authentication Required',
                message: 'Please provide your email address to use Solid Focus.',
                priority: 2
              });
        }
    });
});

const profileMenuHtml = `
<div class="dropdown">
    <a id="userProfileInfo" class="dropdown-toggle small pt-2" style="color: white;" data-toggle="dropdown" href="#" role="button"
        aria-haspopup="true" aria-expanded="false"><div class="small" id="userProfileInfo"></div></a>
    <div class="dropdown-menu">
        <button class="dropdown-item" type="button" id="btnUpdateEmail">
        <i class="far fa-envelope me-2"></i>Update Email
    </button>
        <div role="separator" class="dropdown-divider"></div>
        <button class="dropdown-item" type="button" id="btnLogout">
        <i class="fas fa-sign-out-alt me-2"></i>Sign Out
    </button>
    </div>
</div>
`;

// Add this JavaScript to handle the profile button:
document.addEventListener('DOMContentLoaded', function() {
  // Insert the menu HTML
  const menuContainer = document.getElementById('userProfileMenu');
  if (menuContainer) {
    menuContainer.innerHTML = profileMenuHtml;
  }


  // Update profile info
  const updateProfileInfo = async () => {
    const user = await authService.getCurrentUser();
    if (user) {
      const profileInfo = document.getElementById('userProfileInfo');
      const profileInitial = document.querySelector('.profile-initial');
      const currentEmail = document.querySelector('.current-email');

      if (profileInfo) profileInfo.textContent = user.email;
      if (profileInitial) profileInitial.textContent = user.email.charAt(0);
      if (currentEmail) currentEmail.textContent = user.email;
    }
  };

  // Initial profile info update
  updateProfileInfo();

});

// Handle email update
document.getElementById('btnUpdateEmail')?.addEventListener('click', async () => {
    try {
      await authService.promptForEmail(true);
      updateProfileInfo(); // Refresh the display after update

      // Show success message using bootstrap toast
      const toast = document.createElement('div');
      toast.className = 'position-fixed top-0 end-0 p-3';
      toast.style.zIndex = '9999';
      toast.innerHTML = `
        <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">
              Email updated successfully!
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      const bsToast = new bootstrap.Toast(toast.querySelector('.toast'));
      bsToast.show();
      setTimeout(() => toast.remove(), 3000);
    } catch (error) {
      if (error.message !== 'Email update cancelled') {
        // Show error toast
        const toast = document.createElement('div');
        toast.className = 'position-fixed top-0 end-0 p-3';
        toast.style.zIndex = '9999';
        toast.innerHTML = `
          <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
              <div class="toast-body">
                ${error.message}
              </div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        `;
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast.querySelector('.toast'));
        bsToast.show();
        setTimeout(() => toast.remove(), 3000);
      }
    }
  });

  // Handle logout
  document.getElementById('btnLogout')?.addEventListener('click', async () => {
    try {
      await authService.logOut();
      location.reload(); // Refresh page to reinitialize auth state
    } catch (error) {
      console.error('Logout failed:', error);
    }
  });
