
document.addEventListener("DOMContentLoaded", () => {
  let lang = localStorage.getItem("lang") || "vi";
  let userName = localStorage.getItem("name") || "";

  // Toggle ngôn ngữ
  const langBtn = document.getElementById("toggle-lang");
  langBtn.innerText = lang === "vi" ? "EN" : "VI";
  langBtn.addEventListener("click", () => {
    lang = lang === "vi" ? "en" : "vi";
    localStorage.setItem("lang", lang);
    location.reload();
  });

  // Toggle dark mode
  const darkModeBtn = document.getElementById("toggle-dark-mode");
  darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const current = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", current);
  });
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  // Nếu đã có tên → skip nhập tên
  if (userName) {
    document.getElementById("name-input-screen").classList.add("hidden");
    document.getElementById("welcome-text").innerText =
      (lang === "vi"
        ? `Xin chào ${userName}! Tớ là Bon – bạn đồng hành học tập của bạn!`
        : `Hello ${userName}! I'm Bon – your learning buddy!`);
    document.getElementById("welcome-screen").classList.remove("hidden");
  }

  // Nhập tên → chuyển sang chào
  document.getElementById("submit-name").addEventListener("click", () => {
    const name = document.getElementById("name-input").value.trim();
    if (name) {
      localStorage.setItem("name", name);
      userName = name;
      document.getElementById("name-input-screen").classList.add("hidden");
      document.getElementById("welcome-text").innerText =
        (lang === "vi"
          ? `Xin chào ${userName}! Tớ là Bon – bạn đồng hành học tập của bạn!`
          : `Hello ${userName}! I'm Bon – your learning buddy!`);
      document.getElementById("welcome-screen").classList.remove("hidden");
    } else {
      alert(lang === "vi" ? "Vui lòng nhập tên!" : "Please enter your name!");
    }
  });

  // Bắt đầu học → vào menu
  document.getElementById("start-learning").addEventListener("click", () => {
    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
  });

  // Điều hướng từ menu sang từng phần học
  document.querySelectorAll("#main-menu [data-section]").forEach((el) => {
    el.addEventListener("click", () => {
      const section = el.dataset.section;
      document.getElementById("main-menu").classList.add("hidden");
      document.getElementById(`${section}-section-screen`).classList.remove("hidden");
      if (section === "math") showMathQuestion();
      if (section === "alphabet") showAlphabet();
    });
  });

  // Nút quay về menu
  document.querySelectorAll("[id^='back-to-menu']").forEach((el) => {
    el.addEventListener("click", () => {
      document.querySelectorAll(".text-center").forEach((div) => div.classList.add("hidden"));
      document.getElementById("main-menu").classList.remove("hidden");
    });
  });

  // MODULE TOÁN
  let mathData = [
    { question: "1 + 1 = ?", correct: 2, options: [2, 3, 1] },
    { question: "2 + 2 = ?", correct: 4, options: [4, 3, 5] },
    { question: "3 + 1 = ?", correct: 4, options: [4, 5, 3] }
  ];
  let currentMathIndex = 0;

  function showMathQuestion() {
    const q = mathData[currentMathIndex];
    document.getElementById("math-question").innerText = q.question;
    document.getElementById("question-number").innerText = lang === "vi" ? `Câu ${currentMathIndex + 1}` : `Question ${currentMathIndex + 1}`;
    document.querySelectorAll(".answer-button").forEach((btn, i) => {
      btn.innerText = q.options[i];
      btn.onclick = () => checkMathAnswer(q.options[i]);
    });
  }

  function checkMathAnswer(ans) {
    const correct = mathData[currentMathIndex].correct;
    const feedback = document.getElementById("feedback-text");
    if (ans === correct) {
      feedback.innerText = lang === "vi" ? "Chính xác rồi, bạn giỏi lắm!" : "Correct! Great job!";
      currentMathIndex++;
      if (currentMathIndex < mathData.length) {
        setTimeout(() => showMathQuestion(), 1500);
      } else {
        feedback.innerText = lang === "vi" ? "Bạn đã hoàn thành tất cả câu hỏi!" : "You've completed all questions!";
      }
    } else {
      feedback.innerText = lang === "vi" ? "Sai rồi, thử lại nhé!" : "Oops, try again!";
    }
  }

  // MODULE CHỮ CÁI (phụ thuộc alphabetData.js)
  let currentAlphabetIndex = 0;

  function showAlphabet() {
    const data = alphabetData[lang][currentAlphabetIndex];
    document.getElementById("alphabet-letter").innerText = data.letter;
    document.getElementById("alphabet-word").innerText =
      lang === "vi"
        ? `${data.letter} là chữ đầu trong từ "${data.word}"`
        : `${data.letter} is for "${data.word}"`;
    document.getElementById("alphabet-image").src = data.image;

    document.getElementById("listen-button").onclick = () => {
      const audio = new Audio(data.audio);
      audio.play();
    };
  }

  document.getElementById("next-button").addEventListener("click", () => {
    currentAlphabetIndex = (currentAlphabetIndex + 1) % alphabetData[lang].length;
    showAlphabet();
  });
});
