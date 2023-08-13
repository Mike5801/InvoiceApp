function handleInput(inputElement, sanitizeType) {
  const sanitizedValue =
    sanitizeType === "sanitizeTicket"
      ? inputElement.value.replace(/[^0-9]/g, "")
      : sanitizeType === "sanitizeSale"
        ? inputElement.value.replace(/[^0-9.]/g, "")
        : inputElement.value;

  // Apply the numeric value back to the input
  inputElement.value = sanitizedValue;

  minLength = parseInt(inputElement.getAttribute("minlength"), 10);

  missingCharacters = minLength - sanitizedValue.length;

  // Validate against minlength
  if (sanitizedValue.length < minLength) {
    inputElement.setCustomValidity(`Debe contener ${minLength} caracteres. Faltan ${missingCharacters}`);
  } else {
    inputElement.setCustomValidity("");
  }
}
