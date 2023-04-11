var date = new Date();
var day = date.getDate();
var month = date.getMonth();
let birthdayMode = false;
var modal_lay = $(".modal_lay");
var modal_body = $(".modal_body");
var card = $(".birthday");
var cakeBtn = $(".cake");
console.log(day, month);
if (day == 12 && month + 1 == 4) {
  birthdayMode = true;
} else {
  birthdayMode = false;
}
function birthdayModeE() {
  modal_lay.classList.toggle("open-2");
  modal_body.classList.toggle("open-3");
}
var count;
if (birthdayMode) {
  count = 1;
  setTimeout(() => {
    $(".birthday_date").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 2000);
  setTimeout(() => {
    $(".birthday_desc").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 3000);
  birthdayModeE();
}
var closeBtn = document.querySelector(".closeBtn");
closeBtn.onclick = () => {
  birthdayModeE();
  if (birthdayMode && count == 1) {
    playBtn.click();
    count++;
  }
};
cakeBtn.onclick = () => {
  birthdayModeE();
};
modal_lay.onclick = () => {
  birthdayModeE();
};
var card_content = $(".card__container");
