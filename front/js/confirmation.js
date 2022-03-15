const urlSearchParams = new URLSearchParams(window.location.search);
const orderId = urlSearchParams.get("orderId");
document.querySelector('#orderId').textContent = orderId