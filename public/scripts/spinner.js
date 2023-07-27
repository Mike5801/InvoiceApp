function showSpinner() {
  const loadingSpinner = document.getElementById("loadingSpinner");
  const formButtons = document.getElementById("formButtons");

  loadingSpinner.className = "justify-center items-center flex mt-2";
  formButtons.className = "hidden";
}

const invoiceForm = document.getElementById("invoiceForm");
invoiceForm.addEventListener("submit", showSpinner);