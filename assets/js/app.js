const cards_container = document.querySelector("#cards-container");
const prev_btn = document.querySelector("#prev");
const next_btn = document.querySelector("#next");
const current_el = document.querySelector("#current");
const show_btn = document.querySelector("#show");
const hide_btn = document.querySelector("#hide");
const question_el = document.querySelector("#question");
const answer_el = document.querySelector("#answer");
const add_card_btn = document.querySelector("#add-card");
const clear_btn = document.querySelector("#clear");
const add_container = document.querySelector("#add-container");

let current_active_card = 0;

const cards_el = [];

const cards_data = getCardsData();

/* const cards_data = [
   {
      question: 'What must a variable begin with?',
      answer: 'A letter, $ or _'
   },
   {
      question: 'What is a variable?',
      answer: 'Container for a piece of data'
   },
   {
      question: 'Example of Case Sensitive Variable',
      answer: 'thisIsAVariable'
   }
]; */

const createCards = () => {
  cards_data.forEach((data, index) => createCard(data, index));
};

const createCard = (data, index) => {
  const card = document.createElement("div");
  card.classList.add("card");

  if (index === 0) {
    card.classList.add("active");
  }

  card.innerHTML = `
      <div class="inner-card">
         <div class="inner-card-front">
            <p>
               ${data.question}
            </p>
            <span class="delete-card"><i class="fas fa-trash"></i> Delete</span>
         </div>
         <div class="inner-card-back">
            <p>
               ${data.answer}
            </p>
         </div>
      </div>
   `;
  card.addEventListener("click", () => card.classList.toggle("show-answer"));
  card.querySelector(".delete-card").addEventListener("click", () => {
    card.remove();
    cards_data.splice(index, 1);
    updateCurrentText();
    setCardsData(cards_data);
  });

  cards_el.push(card);

  cards_container.appendChild(card);

  updateCurrentText();
};

const updateCurrentText = () => {
  current_el.innerText = `${current_active_card + 1}/${cards_el.length}`;
};

createCards();

function getCardsData() {
  const cards = JSON.parse(localStorage.getItem("cards"));
  if (cards === null || cards.length === 0) {
    document.querySelector(".navigation").style.display = "none";
    clear_btn.setAttribute('disabled', true);
    return [];
  }
  return cards;
}

const setCardsData = (cards) => {
  localStorage.setItem("cards", JSON.stringify(cards));
  window.location.reload();
};

next_btn.addEventListener("click", () => {
  cards_el[current_active_card].className = "card left";

  current_active_card = current_active_card + 1;

  if (current_active_card > cards_el.length - 1) {
    current_active_card = cards_el.length - 1;
  }

  cards_el[current_active_card].className = "card active";

  updateCurrentText();
});

prev_btn.addEventListener("click", () => {
  cards_el[current_active_card].className = "card right";

  current_active_card = current_active_card - 1;

  if (current_active_card < 0) {
    current_active_card = 0;
  }

  cards_el[current_active_card].className = "card active";

  updateCurrentText();
});

show_btn.addEventListener("click", () => add_container.classList.add("show"));

hide_btn.addEventListener("click", () =>
  add_container.classList.remove("show")
);

add_card_btn.addEventListener("click", () => {
  const question = question_el.value;
  const answer = answer_el.value;

  if (question.trim() && answer.trim()) {
    const new_card = { question, answer };

    createCard(new_card);

    question_el.value = "";
    answer_el.value = "";

    add_container.classList.remove("show");

    cards_data.push(new_card);
    setCardsData(cards_data);
  }
});

clear_btn.addEventListener("click", () => {
  if (cards_data.length > 0 && confirm("Are you sure you want to delete all cards?")) {
    localStorage.clear();
    cards_container.innerHTML = "";
    window.location.reload();
  }
});
