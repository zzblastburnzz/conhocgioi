// Global variables
let lang = localStorage.getItem('lang') || 'vi';
let userName = localStorage.getItem('name') || '';
let questionCount = 0;
let currentCorrectAnswer = 0;

let currentSyllable = {};
let quizData = [];
let quizIndex = 0;
let quizScore = 0;

// Translation setup
let translations = {};

async function loadTranslations() {
  const res = await fetch('lang/translations.json');
  translations = await res.json();
  updateText();
}

function updateText() {
  const t = translations[lang];
  document.getElementById('toggle-lang').innerText = lang === 'vi' ? 'EN' : 'VI';
  document.getElementById('greeting-text').innerText = t.welcome.replace('{{name}}', '');
  document.getElementById('submit-name').innerText = t.start;
  document.getElementById('welcome-text').innerText = userName ? t.welcome.replace('{{name}}', userName) : '';
  document.getElementById('start-learning').innerText = t.start;
  document.querySelector('[data-section="math"]').innerText = t.sections.math;
  document.querySelector('[data-section="alphabet"]').innerText = t.sections.alphabet;
  document.querySelector('[data-section="syllable"]').innerText = t.sections.syllable;
  document.querySelector('[data-section="quiz"]').innerText = t.sections.quiz;
  document.querySelector('[data-section="parent"]').innerText = t.sections.parent;
  document.getElementById('back-to-menu').innerText = t.back;
  document.getElementById('back-to-menu-math').innerText = t.back;
  document.getElementById('back-to-menu-alphabet').innerText = t.back;
  document.getElementById('back-to-menu-syllable').innerText = t.back;
  document.getElementById('back-to-menu-quiz').innerText = t.back;
  document.getElementById('quiz-try-again').innerText = t.start;
  document.getElementById('quiz-back-to-menu').innerText = t.back;
}

function generateMathQuestion() {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 1;
  currentCorrectAnswer = a + b;
  const answers = [currentCorrectAnswer];

  while (answers.length < 3) {
    const wrong = Math.floor(Math.random() * 10);
    if (!answers.includes(wrong)) answers.push(wrong);
  }

  answers.sort(() => Math.random() - 0.5);

  document.getElementById('math-question').innerText = `${a} + ${b} = ?`;
  document.getElementById('question-number').innerText = `${translations[lang].question || 'Câu'} ${questionCount + 1}`;

  document.querySelectorAll('.answer-button').forEach((btn, i) => {
    btn.innerText = answers[i];
    btn.onclick = () => checkMathAnswer(answers[i]);
  });

  document.getElementById('feedback-text').innerText = '';
  document.getElementById('bon-image').src = 'assets/bon/bon_suy_nghi.svg';
}

function checkMathAnswer(selected) {
  const feedback = document.getElementById('feedback-text');
  if (selected === currentCorrectAnswer) {
    feedback.innerText = translations[lang].correct;
    document.getElementById('bon-image').src = 'assets/bon/bon_vo_tay.svg';
    questionCount++;
    setTimeout(() => generateMathQuestion(), 1500);
  } else {
    feedback.innerText = translations[lang].wrong;
    document.getElementById('bon-image').src = 'assets/bon/bon_buon.svg';
  }
}

function generateAlphabet() {
  const letters = ['A', 'B', 'C', 'D'];
  const words = { A: 'Áo', B: 'Bò', C: 'Cá', D: 'Dê' };
  const images = { A: 'ao.png', B: 'bo.png', C: 'ca.png', D: 'de.png' };
  const letter = letters[Math.floor(Math.random() * letters.length)];

  document.getElementById('alphabet-letter').innerText = letter;
  document.getElementById('alphabet-word').innerText = `${letter} là chữ đầu trong từ "${words[letter]}"`;
  document.getElementById('alphabet-image').src = `assets/words/${images[letter]}`;
}

function generateSyllable() {
  currentSyllable = { initial: 'b', middle: 'a', end: 'n', word: 'ban' };

  document.getElementById('initial-sound').innerText = currentSyllable.initial;
  document.getElementById('middle-sound').innerText = currentSyllable.middle;
  document.getElementById('ending-sound').innerText = currentSyllable.end;
}

function checkSyllable() {
  const a = document.getElementById('drop-initial').innerText.trim();
  const b = document.getElementById('drop-middle').innerText.trim();
  const c = document.getElementById('drop-ending').innerText.trim();
  const word = a + b + c;

  const feedback = document.getElementById('syllable-feedback');
  if (word === currentSyllable.word) {
    feedback.innerText = translations[lang].correct;
    document.getElementById('bon-syllable-image').src = 'assets/bon/bon_vo_tay.svg';
  } else {
    feedback.innerText = translations[lang].wrong;
    document.getElementById('bon-syllable-image').src = 'assets/bon/bon_buon.svg';
  }
}

function startQuiz(amount) {
  quizData = [];
  quizIndex = 0;
  quizScore = 0;

  for (let i = 0; i < amount; i++) {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    const correct = a + b;
    const options = [correct];
    while (options.length < 3) {
      const wrong = Math.floor(Math.random() * 10);
      if (!options.includes(wrong)) options.push(wrong);
    }
    options.sort(() => Math.random() - 0.5);
    quizData.push({ a, b, correct, options });
  }

  showQuizQuestion();
}

function showQuizQuestion() {
  const q = quizData[quizIndex];
  document.getElementById('quiz-question-number').innerText = `Câu ${quizIndex + 1}`;
  document.getElementById('quiz-question').innerText = `${q.a} + ${q.b} = ?`;
  document.querySelectorAll('.quiz-answer-button').forEach((btn, i) => {
    btn.innerText = q.options[i];
    btn.onclick = () => checkQuizAnswer(q.options[i]);
  });
}

function checkQuizAnswer(answer) {
  const q = quizData[quizIndex];
  const feedback = document.getElementById('quiz-feedback');

  if (answer === q.correct) {
    quizScore++;
    feedback.innerText = translations[lang].correct;
    document.getElementById('bon-quiz-question-image').src = 'assets/bon/bon_vo_tay.svg';
  } else {
    feedback.innerText = translations[lang].wrong;
    document.getElementById('bon-quiz-question-image').src = 'assets/bon/bon_buon.svg';
  }

  quizIndex++;
  if (quizIndex < quizData.length) {
    setTimeout(() => showQuizQuestion(), 1500);
  } else {
    setTimeout(() => {
      document.getElementById('quiz-question-screen').classList.add('hidden');
      document.getElementById('quiz-completion-screen').classList.remove('hidden');
      document.getElementById('quiz-score').innerText = `${quizScore}/${quizData.length}`;
    }, 1500);
  }
}

// Event Listeners tiếp tục bên dưới... (đã có từ trước)
// Sự kiện khi bấm nút "Vào học nào"
document.getElementById("submit-name").addEventListener("click", () => {
  const name = document.getElementById("name-input").value.trim();
  if (name !== "") {
    localStorage.setItem("name", name);
    userName = name;

    document.getElementById("name-input-screen").classList.add("hidden");
    document.getElementById("welcome-text").innerText = translations[lang].welcome.replace('{{name}}', userName);
    document.getElementById("welcome-screen").classList.remove("hidden");
  } else {
    alert("Bạn vui lòng nhập tên trước khi bắt đầu nhé!");
  }
});

// Khi bấm nút "Bắt đầu học" → vào menu chính
document.getElementById("start-learning").addEventListener("click", () => {
  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
});
