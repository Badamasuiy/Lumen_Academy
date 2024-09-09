// Registration handling
function registerCandidate() {
    const schoolName = document.getElementById('schoolName').value;
    const candidateName = document.getElementById('candidateName').value;
    const registrationDeadline = new Date('2024-09-8T23:59:59'); // Set deadline
    const currentDate = new Date();
  
    if (!schoolName || !candidateName) {
      alert('Please fill in both the school name and candidate name.');
      return;
    }
  
    if (currentDate > registrationDeadline) {
      const payFine = confirm('Registration closed! A fine of N5,000 is required to register. Do you want to proceed?');
      if (!payFine) return;
  
      alert('Fine payment processed successfully. You can now register.');
    }
  
    // Save registration details to local storage
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    candidates.push({ schoolName, candidateName });
    localStorage.setItem('candidates', JSON.stringify(candidates));
  
    alert('Registration Successful!');
    //transitionToQuiz(schoolName, candidateName);
    window.location.href = "home.html";
  }
  
  function transitionToQuiz(schoolName, candidateName) {
    document.getElementById('registration').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
  
    // Display the name of the academy and student on the quiz page
    document.getElementById('quizAcademyName').innerText = `Academy: ${schoolName}`;
    document.getElementById('quizStudentName').innerText = `Student: ${candidateName}`;
  
    startQuiz();
  }
  
  // Quiz logic
  let quizQuestions = [
    { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correctAnswer: "4" },
    { question: "What is the color of the sky on a clear day?", answers: ["Blue", "Red", "Green", "Yellow"], correctAnswer: "Blue" },
    { question: "How many continents are there?", answers: ["5", "6", "7", "8"], correctAnswer: "7" },
    { question: "Which animal is known as the 'King of the Jungle'?", answers: ["Elephant", "Tiger", "Lion", "Giraffe"], correctAnswer: "Lion" },
    { question: "What is the boiling point of water in degrees Celsius?", answers: ["50", "90", "100", "120"], correctAnswer: "100" },
    { question: "Which planet is closest to the Sun?", answers: ["Venus", "Earth", "Mars", "Mercury"], correctAnswer: "Mercury" },
    { question: "Which month has 28 days (or 29 in a leap year)?", answers: ["January", "February", "March", "April"], correctAnswer: "February" },
    { question: "What is the chemical symbol for water?", answers: ["H2", "O2", "H2O", "CO2"], correctAnswer: "H2O" },
    { question: "How many sides does a triangle have?", answers: ["2", "3", "4", "5"], correctAnswer: "3" },
    { question: "Which fruit is known for keeping doctors away when eaten daily?", answers: ["Banana", "Apple", "Orange", "Mango"], correctAnswer: "Apple" }
  ];
  
  let userAnswers = []; // To track user answers
  let correctAnswers = 0; // To count correct answers
  
  function shuffleQuestions() {
    quizQuestions.sort(() => Math.random() - 0.5);
  }
  
  function startQuiz() {
    shuffleQuestions();
    displayQuestion(0);
    startTimer();
  }
  
  function displayQuestion(index) {
    const question = quizQuestions[index];
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `<p class="mb-4">${question.question}</p>` + question.answers.map((answer, i) => 
      `<button onclick="submitAnswer(${index}, '${answer}')" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mb-2">${answer}</button>`
    ).join('');
  }
  
  let quizTime = 120; // 2 minutes
  function startTimer() {
    const timerInterval = setInterval(() => {
      quizTime--;
      document.getElementById('timer').innerText = `Time Left: ${quizTime}s`;
      if (quizTime <= 0) {
        clearInterval(timerInterval);
        endQuiz();
      }
    }, 1000);
  }
  
  function submitAnswer(questionIndex, selectedAnswer) {
    const question = quizQuestions[questionIndex];
    userAnswers.push(selectedAnswer);
  
    if (selectedAnswer === question.correctAnswer) {
      correctAnswers++;
      playSound('correct-sound.mp3');
    } else {
      playSound('wrong-sound.mp3');
    }
  
    if (questionIndex + 1 < quizQuestions.length) {
      displayQuestion(questionIndex + 1);
    } else {
      endQuiz();
    }
  }
  
  function endQuiz() {
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    displayResults();
  }
  
  // Display results with percentage, score, and a congratulatory message
  function displayResults() {
    const totalQuestions = quizQuestions.length;
    const percentageScore = (correctAnswers / totalQuestions) * 100;
  
    // Fetch academy and student names from local storage
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    const latestCandidate = candidates[candidates.length - 1]; // Get the last registered candidate
  
    // Display names and scores
    document.getElementById('academyName').innerText = `Academy: ${latestCandidate.schoolName}`;
    document.getElementById('studentName').innerText = `Student: ${latestCandidate.candidateName}`;
    document.getElementById('score').innerText = `Score: ${correctAnswers} / ${totalQuestions} (${percentageScore.toFixed(2)}%)`;
  
    // Display a congratulatory message based on performance
    const congratulatoryMessage = percentageScore >= 50 ? "Congratulations! You passed!" : "Better luck next time!";
    document.getElementById('congratulatoryMessage').innerText = congratulatoryMessage;
  
    // Save the winner if the score is 50% or higher
    if (percentageScore >= 50) {
      saveWinner(latestCandidate.schoolName, latestCandidate.candidateName);
    }
  }
  
  // Save the winning school's name and student to local storage
  function saveWinner(schoolName, studentName) {
    const winners = JSON.parse(localStorage.getItem('winners')) || [];
    winners.push({ schoolName, studentName });
    localStorage.setItem('winners', JSON.stringify(winners));
  }
  
  function showWinners(winners) {
    const winnerMessage = winners.map(winner => 
      `${winner.school}, ${winner.name}`).join(', ');
    document.getElementById('winnerMessage').innerText = `Congratulations to our winners: ${winnerMessage}`;
    document.getElementById('winnerModal').classList.remove('hidden');
  }
  
  function closeModal() {
    document.getElementById('winnerModal').classList.add('hidden');
  }
  
  function playSound(soundPath) {
    const audio = new Audio(soundPath);
    audio.play();
  }
  