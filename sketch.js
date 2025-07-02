let table;
let allQuestions = [];
let questions = [];
let current = 0;
let score = 0;
let life = 3;
let isGameOver = false;
const TIME_LIMIT = 7 * 60; // 7秒 * 60fps
let timer = TIME_LIMIT;

// フィードバック表示用
let feedback = "";
let feedbackTimer = 0;
const FEEDBACK_DURATION = 120; // 2秒（60fps * 2）

function preload() {
  table = loadTable("words.csv", "csv", "header");
}

function setup() {
  createCanvas(600, 400);
  textSize(24);

  // CSVから問題を読み込み
  for (let i = 0; i < table.getRowCount(); i++) {
    const row = table.getRow(i);
    allQuestions.push({
      word: row.get("word"),
      correct: row.get("correct"),
      choices: shuffle([row.get("correct"), row.get("choice1"), row.get("choice2"), row.get("choice3")])
    });
  }

  resetGame();
}

function resetGame() {
  score = 0;
  life = 3;
  isGameOver = false;
  current = 0;
  timer = TIME_LIMIT;
  feedback = "";
  feedbackTimer = 0;

  shuffleArray(allQuestions);
  questions = allQuestions.slice(0, 10);
}

function draw() {
  background(30);
  fill(255);

  textSize(24);
  textAlign(LEFT);
  text("スコア: " + score + " / " + questions.length, 10, 30);
  text("ライフ: " + life, 10, 70);

  if (isGameOver) {
    textAlign(CENTER);
    textSize(36);
    text("ゲームオーバー！", width / 2, height / 2 - 40);
    textSize(24);
    text("最終スコア: " + score + " / " + questions.length, width / 2, height / 2 + 10);
    text("リスタート: Rキーを押す", width / 2, height / 2 + 60);
    textAlign(LEFT);
    return;
  }

  if (current >= questions.length) {
    textAlign(CENTER);
    textSize(36);
    text("全問終了！", width / 2, height / 2 - 40);
    textSize(24);
    text("最終スコア: " + score + " / " + questions.length, width / 2, height / 2 + 10);
    text("リスタート: Rキーを押す", width / 2, height / 2 + 60);
    textAlign(LEFT);
    return;
  }

  const q = questions[current];

  textAlign(LEFT);
  textSize(24);
  text("英単語: " + q.word, 50, 120);
  for (let i = 0; i < 4; i++) {
    text((i + 1) + ": " + q.choices[i], 50, 180 + i * 40);
  }

  fill(255, 100, 100);
  textSize(20);
  text("残り時間: " + Math.ceil(timer / 60) + "秒", width - 180, 30);

  if (feedbackTimer > 0) {
    textAlign(CENTER);
    fill(255, 255, 0);
    textSize(28);
    text(feedback, width / 2, height - 40);
    feedbackTimer--;

    if (feedbackTimer === 0) {
      if (life <= 0) {
        isGameOver = true;
      } else {
        current++;
        timer = TIME_LIMIT;
        feedback = "";
      }
    }

    // ★描画スタイルを元に戻す
    textAlign(LEFT);
    textSize(24);

    return;
  }

  // タイマー進行
  if (timer > 0) {
    timer--;
  } else {
    showFeedback(false, q.correct); // 時間切れも不正解扱い
  }
}

function keyPressed() {
  if (isGameOver || current >= questions.length) {
    if (key === 'r' || key === 'R') {
      resetGame();
    }
    return;
  }

  if (feedbackTimer > 0) return;

  let choice = int(key) - 1;
  if (choice >= 0 && choice < 4) {
    const q = questions[current];
    const isCorrect = (q.choices[choice] === q.correct);
    showFeedback(isCorrect, q.correct);
  }
}

function showFeedback(isCorrect, correctAnswer = "") {
  if (isCorrect) {
    score++;
    feedback = "◯ 正解！";
  } else {
    life--;
    feedback = "✕ 不正解！ 正解は: " + correctAnswer;
  }
  feedbackTimer = FEEDBACK_DURATION;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
