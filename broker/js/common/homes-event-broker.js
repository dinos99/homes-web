/* 사용자계정 */
var account = document.querySelector("header .right-menu .account");
var accountBtn = document.querySelector("header .right-menu .account button");
var accountBox = document.querySelector("header .right-menu .account-box");

if (account) {
  account.addEventListener("click", function () {
    accountBox.classList.toggle("active");
    accountBtn.classList.toggle("active");
  });
}

/* qrcode */
var qrbtn = document.querySelector("#btn_qrcode");

if (qrbtn) {
  qrbtn.addEventListener("click", function () {
    qrcode = document.querySelector(".qr-code") ;
    qrcode.classList.toggle("active");
  });
}