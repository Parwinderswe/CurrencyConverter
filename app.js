// const BASE_URL =
//   "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const API_BASE = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const API_FALLBACK = "https://latest.currency-api.pages.dev/v1/currencies"; 

async function fetchRate(from, to) {
  const urls = [
    `${API_BASE}/${from}.json`,
    `${API_FALLBACK}/${from}.json`, 
   
  ];

  for (const url of urls) {
    try {
      console.log("Fetching:", url); 
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue; 
      const data = await res.json();   
      const rate = data?.[from]?.[to];
      if (typeof rate === "number") return rate;
    } catch {
      
    }
  }
  throw new Error(`Rate not found for ${from.toUpperCase()} → ${to.toUpperCase()}`);
}

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  
  const amountEl = document.querySelector(".amount input");
  let amtVal = Number(amountEl.value);
  if (!amtVal || amtVal < 1) 
    { amtVal = 1; amountEl.value = "1"; }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  try {
    const rate = await fetchRate(from, to);
    const finalAmount = amtVal * rate;
    msg.textContent = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(4)} ${toCurr.value}`;
  } catch (e) {
    console.error(e);
    msg.textContent = "Could not fetch exchange rate. Please try again.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});