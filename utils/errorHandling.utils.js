export const handleInitialInformationError = () => {
  throw new Error("Did not entered to form for initial information of invoice");
}

export const handleClientInformationError = () => {
  throw new Error("Did not entered to form for client information");
}

export const handleSendingInvoiceError = () => {
  throw new Error("Did not entered to send invoice step");
}