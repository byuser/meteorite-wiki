/*
 * Pure, DOM-free helpers for scoring the meteorite self-test quiz.
 * Kept separate from main.js so the logic can be unit tested under Node.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MeteoriteQuiz = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // True when the chosen option index is the question's correct answer.
  function isCorrect(question, choiceIndex) {
    if (!question) return false;
    return Number(choiceIndex) === question.answer;
  }

  // Count correct answers. `answers` maps a question id to a chosen index.
  function scoreQuiz(questions, answers) {
    answers = answers || {};
    return (questions || []).reduce(function (total, q) {
      return total + (isCorrect(q, answers[q.id]) ? 1 : 0);
    }, 0);
  }

  // A friendly verdict for a score out of total.
  function gradeMessage(score, total) {
    if (!total) return "No questions to grade.";
    var pct = score / total;
    if (pct === 1) return "Perfect score — you're a meteorite expert! ☄️";
    if (pct >= 0.7) return "Great work — you really know your space rocks.";
    if (pct >= 0.4) return "Not bad — give the other pages a read and try again.";
    return "A tricky start — explore the wiki and have another go.";
  }

  return {
    isCorrect: isCorrect,
    scoreQuiz: scoreQuiz,
    gradeMessage: gradeMessage
  };
});
