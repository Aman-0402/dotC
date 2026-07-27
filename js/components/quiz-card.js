export function mountQuiz(container, questions) {
  let currentIndex = 0;
  let correctCount = 0;
  let answered = false;

  renderQuestion();

  function renderQuestion() {
    const q = questions[currentIndex];
    container.innerHTML = `
      <div class="card quiz-card">
        <div class="quiz-card-question">${q.question}</div>
        <div class="quiz-card-options">
          ${q.options.map((option, i) => `
            <div class="quiz-card-option" data-index="${i}">
              <span class="quiz-card-marker"></span>
              ${option}
            </div>
          `).join('')}
        </div>
        <div class="quiz-card-explanation" hidden>${q.explanation}</div>
        <button class="quiz-card-next" hidden type="button">Next Question →</button>
      </div>
    `;

    answered = false;
    container.querySelectorAll('.quiz-card-option').forEach(optionEl => {
      optionEl.addEventListener('click', () => handleAnswer(optionEl, q));
    });

    container.querySelector('.quiz-card-next').addEventListener('click', handleNext);
  }

  function handleAnswer(optionEl, q) {
    if (answered) return;
    answered = true;

    const selectedIndex = Number(optionEl.dataset.index);
    const isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) correctCount++;

    container.querySelectorAll('.quiz-card-option').forEach(el => {
      const index = Number(el.dataset.index);
      const marker = el.querySelector('.quiz-card-marker');
      if (index === q.correctIndex) {
        el.classList.add('quiz-card-option-correct');
        marker.textContent = '✓';
      } else if (index === selectedIndex) {
        el.classList.add('quiz-card-option-incorrect');
        marker.textContent = '✗';
      }
    });

    container.querySelector('.quiz-card-explanation').hidden = false;
    container.querySelector('.quiz-card-next').hidden = false;
  }

  function handleNext() {
    currentIndex++;
    if (currentIndex < questions.length) {
      renderQuestion();
    } else {
      renderSummary();
    }
  }

  function renderSummary() {
    container.innerHTML = `
      <div class="card quiz-card">
        <div class="quiz-card-question">You scored ${correctCount} of ${questions.length}</div>
      </div>
    `;
  }
}
