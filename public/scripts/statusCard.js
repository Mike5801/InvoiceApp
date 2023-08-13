const statusCardButton = document.getElementById("closeButton");

function closeStatusCard() {
  const statusCard = document.getElementById("statusCard");

  statusCard.className = "hidden";
}

statusCardButton.addEventListener("click", closeStatusCard);
