
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || "vi";
  const userName = localStorage.getItem("name") || "";

  document.getElementById("toggle-lang").addEventListener("click", () => {
    const newLang = lang === "vi" ? "en" : "vi";
    localStorage.setItem("lang", newLang);
    location.reload();
  });

  // Sự kiện khi bấm nút "Vào học nào"
  document.getElementById("submit-name").addEventListener("click", () => {
    const name = document.getElementById("name-input").value.trim();
    if (name !== "") {
      localStorage.setItem("name", name);
      document.getElementById("name-input-screen").classList.add("hidden");
      document.getElementById("welcome-text").innerText = `Xin chào ${name}! Tớ là Bon – bạn đồng hành học tập của bạn!`;
      document.getElementById("welcome-screen").classList.remove("hidden");
    } else {
      alert("Bạn vui lòng nhập tên trước khi bắt đầu nhé!");
    }
  });

  // Sự kiện khi bấm "Bắt đầu học"
  document.getElementById("start-learning").addEventListener("click", () => {
    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
  });

  // Toán học - logic xử lý
  let mathData = [
    { question: "1 + 1 = ?", correct: 2, options: [2, 3, 1] },
    { question: "2 + 2 = ?", correct: 4, options: [4, 3, 5] },
    { question: "3 + 1 = ?", correct: 4, options: [4, 5, 3] },
    { question: "4 + 2 = ?", correct: 6, options: [6, 7, 5] },
    { question: "5 + 3 = ?", correct: 8, options: [8, 7, 9] },
    { question: "6 + 2 = ?", correct: 8, options: [8, 6, 9] },
    { question: "7 + 1 = ?", correct: 8, options: [8, 6, 9] },
    { question: "3 + 4 = ?", correct: 7, options: [7, 6, 8] },
    { question: "2 + 5 = ?", correct: 7, options: [6, 7, 8] },
    { question: "4 + 3 = ?", correct: 7, options: [7, 6, 8] }
  ];
  let currentMathIndex = 0;

  function showMathQuestion() {
    const q = mathData[currentMathIndex];
    document.getElementById('math-question').innerText = q.question;
    document.getElementById('question-number').innerText = `Câu ${currentMathIndex + 1}`;
    document.querySelectorAll('.answer-button').forEach((btn, i) => {
      btn.innerText = q.options[i];
      btn.onclick = () => checkMathAnswer(q.options[i]);
    });
  }

  function checkMathAnswer(ans) {
    const correct = mathData[currentMathIndex].correct;
    const feedback = document.getElementById('feedback-text');
    if (ans === correct) {
      feedback.innerText = "Chính xác rồi, bạn giỏi lắm!";
      currentMathIndex++;
      if (currentMathIndex < mathData.length) {
        setTimeout(() => showMathQuestion(), 1500);
      } else {
        feedback.innerText = "Bạn đã hoàn thành tất cả câu hỏi!";
      }
    } else {
      feedback.innerText = "Sai rồi, thử lại nhé!";
    }
  }
});
const alphabetData = [
  { letter: "A", word: "Áo", image: "assets/words/ao.png", audio: "audio/vi/a.mp3" },
  { letter: "B", word: "Bò", image: "assets/words/bo.png", audio: "audio/vi/b.mp3" },
  { letter: "C", word: "Cá", image: "assets/words/ca.png", audio: "audio/vi/c.mp3" },
  { letter: "D", word: "Đèn", image: "assets/words/den.png", audio: "audio/vi/d.mp3" },
  { letter: "E", word: "Ếch", image: "assets/words/ech.png", audio: "audio/vi/e.mp3" }
  // … thêm tiếp nếu muốn đủ A → Z
];
let currentAlphabetIndex = 0;
function showAlphabet() {
  const data = alphabetData[currentAlphabetIndex];
  document.getElementById("alphabet-letter").innerText = data.letter;
  document.getElementById("alphabet-word").innerText = `${data.letter} là chữ đầu trong từ "${data.word}"`;
  document.getElementById("alphabet-image").src = data.image;
  document.getElementById("listen-button").onclick = () => playAudio(data.audio);
}

document.getElementById("next-button").addEventListener("click", () => {
  currentAlphabetIndex = (currentAlphabetIndex + 1) % alphabetData.length;
  showAlphabet();
});

function playAudio(src) {
  const audio = new Audio(src);
  audio.play();
}
