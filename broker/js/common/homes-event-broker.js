/* qrcode */
var qrbtn = document.querySelector("#btn_qrcode");
if (qrbtn) {
  qrbtn.addEventListener("click", function () {
    qrcode = document.querySelector(".qr-code") ;
    qrcode.classList.toggle("active");
  });
}

