const concepts = {
  tokens: {
    title: "Tokens",
    analogy: "Like breaking a sentence into bite-sized pieces before cooking. The model cannot eat the whole paragraph at once; it processes chunks.",
    technical: "Tokens are the units of text the model reads and generates. They may be words, parts of words, punctuation, or symbols.",
    project: "In MedicalDiary, long parent notes and doctor reports must fit into a model's context window, so token usage affects cost and reliability."
  },
  embeddings: {
    title: "Embeddings",
    analogy: "Like organizing restaurants by vibe, cuisine, price, kid-friendliness, and distance instead of alphabetically.",
    technical: "Embeddings convert text, images, or other data into vectors so similar meanings are close together mathematically.",
    project: "In AetherSignal, embeddings can help retrieve semantically similar adverse event narratives, even when wording differs."
  },
  rag: {
    title: "RAG",
    analogy: "Like answering an interview question by first pulling the right memories from your career instead of relying on vague memory.",
    technical: "Retrieval-Augmented Generation retrieves relevant external knowledge before asking the model to generate an answer.",
    project: "In MedicalDiary, RAG lets the assistant answer from a child's actual history instead of generic medical text."
  },
  agents: {
    title: "Agents",
    analogy: "Like a house project with a contractor coordinating a plumber, electrician, inspector, and designer.",
    technical: "Agents are systems that can plan, choose tools, execute steps, observe results, and continue toward a goal.",
    project: "Corporate Safety Intake may use agent-like workflows for extraction, follow-up drafting, readiness checks, and routing."
  },
  evals: {
    title: "AI Evaluation",
    analogy: "Like test-driving a car before buying it: speed alone is not enough; you test safety, braking, comfort, mileage, reliability.",
    technical: "AI evaluation measures quality across accuracy, groundedness, safety, latency, cost, regressions, and user outcomes.",
    project: "Your AI Gateway and Morgan Stanley evaluation framework story should emphasize this as a production-readiness discipline."
  }
};

document.querySelectorAll('.concepts button').forEach(button => {
  button.addEventListener('click', () => {
    const c = concepts[button.dataset.concept];
    document.getElementById('concept-detail').innerHTML = `
      <h3>${c.title}</h3>
      <p><strong>Everyday analogy:</strong> ${c.analogy}</p>
      <p><strong>Technical meaning:</strong> ${c.technical}</p>
      <p><strong>Your project lens:</strong> ${c.project}</p>
    `;
  });
});

const questions = [
  "Explain what happens when you ask ChatGPT a question.",
  "Why is ChatGPT not just a model, but a full AI application system?",
  "How would you explain context assembly using the driving-to-office analogy?",
  "Where would validation fit in MedicalDiary before returning an answer to a parent?",
  "How would you explain this system to a CEO in 60 seconds?"
];
let qIndex = 0;
function nextQuestion() {
  qIndex = (qIndex + 1) % questions.length;
  document.getElementById('question').textContent = questions[qIndex];
}
