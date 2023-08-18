const twoFADropdown = document.getElementById("twoFADropdown");
const twoFADropdownIcon = document.getElementById("twoFADropdownIcon");
const twoFAActivateButton = document.getElementById("twoFAButtonActivate");
const twoFAContent = document.getElementById("twoFAContent");

const waitTime = (time) => new Promise((resolve) => setTimeout(resolve, time));

let hasQRData = false;

const showTwoFAContentClass =
  "grid grid-cols-3 gap-y-1 w-full h-full opacity-100";
const hideTwoFAContentClass = "hidden";

let isTwoFAActive = false;
const activeAngle = "fa-solid fa-angle-down text-gray-500";
const inactiveAngle = "fa-solid fa-angle-left text-gray-500";

const twoFADropdownCard = document.getElementById("twoFADropdownCard");

const showContentClass =
  "flex flex-col justify-center items-center w-full h-auto bg-gray-50 rounded-b-xl shadow-md -translate-y-2 transition-all duration-200 p-5";
const hideContentClass =
  "flex flex-col justify-center items-center w-full h-0 bg-gray-50 rounded-b-xl shadow-md -translate-y-10 transition-all duration-200 p-5";

twoFADropdownCard.className = hideContentClass;

twoFADropdown.addEventListener("click", async () => {
  isTwoFAActive = !isTwoFAActive;

  if (isTwoFAActive) {
    twoFADropdownIcon.className = activeAngle;
    twoFADropdownCard.className = showContentClass;
  } else {
    twoFADropdownIcon.className = inactiveAngle;
    twoFADropdownCard.className = hideContentClass;
  }

  if (isTwoFAActive && hasQRData) {
    twoFAContent.className = showTwoFAContentClass;
  } else {
    twoFAContent.className = hideTwoFAContentClass;
  }
});

const spinner = document.getElementById("loadingSpinner");
const spinnerClass = "justify-center items-center flex mt-3";

const showLoading = () => {
  spinner.className = spinnerClass;
  twoFAActivateButton.className = "hidden";
};

const hideLoading = () => {
  spinner.className = "hidden";
};

async function generateOTP(baseUrl) {
  try {
    showLoading();

    const response = await fetch(`${baseUrl}/generateOTP`, {
      method: "GET",
    });

    const formattedResponse = await response.json();

    hideLoading();

    const otpAuthUrl = formattedResponse.otpAuthUrl;
    const base32Secret = formattedResponse.base32Secret;

    twoFAContent.className = showTwoFAContentClass;
    hasQRData = true;

    const secretText = document.getElementById("base32Secret");
    new QRCode(document.getElementById("qrCode"), otpAuthUrl);
    secretText.innerHTML = base32Secret;
  } catch (error) {
    console.log(error.message);
  }
}

async function activateOTP(baseUrl) {
  const token = document.getElementById("token").value;
  const status = document.getElementById("activateTwoFAStatus");
  const activateTwoFAForm = document.getElementById("activateTwoFAForm");

  try {
    const response = await fetch(`${baseUrl}/activateOTP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token,
      }),
    });

    if (!response.ok) {
      throw new Error("Not successfull response", { cause: response });
    }

    const content = 
    `
      <img class="object-contain w-36 h-36" src="/images/checkMark.png" alt="status">
      <p class="text-lg font-medium text-green-500"> Autenticación por 2 pasos activada! </p>
    `;

    activateTwoFAForm.innerHTML = content;

    await waitTime(1000);

    window.location.href = "/user/configuration";

  } catch (error) {
    status.innerHTML = "Clave incorrecto";
  }
}
