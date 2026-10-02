const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";
const dropdowns = document.querySelectorAll(".select-container select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector('select[name="from"]');
const toCurr = document.querySelector('select[name="to"]');
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = "https://flagsapi.com/" + countryCode + "/flat/64.png";
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

const updateExchangeRate = async () => {
  let amtVal = Number(amountInput.value);
  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }
  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();
  try {
    const res = await fetch(BASE_URL + "/" + from+ ".json");
    const data = await res.json();
    const rate = data[from][to];
    const finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = amtVal + " " + fromCurr.value + " = " + finalAmount + " " + toCurr.value;
  } catch (error) {
    msg.innerText = "Could not fetch exchange rate. Try again.";
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", updateExchangeRate);