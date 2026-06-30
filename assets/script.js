/* ---------------------------------------------------------------------------
   Athena — private AI interview prep. All content data + interactivity.
   Story scaffold answers persist to localStorage (this browser only).
--------------------------------------------------------------------------- */

/* ----------------------------- CONCEPT MAP ------------------------------- */
const concepts = {
  embeddings: {
    title: "Embeddings & Semantic Search",
    analogy: "Someone asks for a good Indian place near Edison. You don't scan for the words \u201cIndian\u201d and \u201crestaurant\u201d \u2014 your mind jumps to somewhere with the same feel: family-friendly, veg, kids liked it. You're matching meaning, not words.",
    technical: "Embeddings convert text into vectors in a \u201cmeaning space\u201d so semantically similar things sit close together, even with no shared words. They power semantic and hybrid search.",
    say: "An embedding is a numeric fingerprint of meaning. We use them so \u201cbaby is burning,\u201d \u201chigh fever,\u201d and \u201ctemp 103\u201d all retrieve the same thing. The real enterprise questions aren't \u201cwhat is an embedding\u201d but which model, how you keep vectors fresh as docs change, and re-embedding cost when you swap models.",
    push: "\u201cWhy not just keyword search \u2014 cheaper and explainable?\u201d It's not either/or. Hybrid (keyword + vector + reranker) usually wins. Keyword for exact terms and auditable recall; vectors for paraphrase and synonyms."
  },
  rag: {
    title: "RAG",
    analogy: "In an interview, \u201cwhat have you built?\u201d \u2014 you don't replay every project from memory. You retrieve the three relevant ones, then answer. Retrieve first, then generate.",
    technical: "Retrieval-Augmented Generation fetches relevant context at query time and hands it to the model, instead of relying on what's baked into the weights. Keeps answers current and grounded.",
    say: "RAG lets the model answer from your private, changing data without retraining: embed the question, retrieve top matches, put them in the prompt, generate with citations. For a regulated product the value is groundedness and auditability \u2014 I can show which source produced the answer.",
    push: "\u201cDoesn't RAG eliminate hallucinations?\u201d No \u2014 saying yes is a tell. It reduces them by grounding, but the model can still ignore retrieved context, or retrieval can miss. You manage it with reranking, citation-checking, and eval."
  },
  ragft: {
    title: "RAG vs. Fine-tuning",
    analogy: "RAG is handing someone the right open book before they answer. Fine-tuning is sending them to school to change how they think. Facts that change weekly? Hand them the book. A new skill or style? Send them to school.",
    technical: "RAG injects knowledge at query time. Fine-tuning changes the model's behavior, format, or tone. Different problems \u2014 and they often combine.",
    say: "Default to RAG when knowledge changes often, needs auditability, or is large. Reach for fine-tuning when you need a consistent behavior or format prompting can't reliably get. Fine-tune for how it responds, RAG for what it knows. Start with RAG, measure where it fails, fine-tune only those gaps.",
    push: "\u201cWe have 10k tickets \u2014 fine-tune on them?\u201d Ask first: is the goal knowledge (RAG) or behavior/tone (maybe fine-tune)? And what's the retraining + governance cost each time the data changes?"
  },
  context: {
    title: "Context Window",
    analogy: "Driving, you're not holding your wedding day and yesterday's breakfast in mind \u2014 just road, cars, the light, the call. Working memory holds only what's relevant now.",
    technical: "The context window is the model's working memory \u2014 everything it can see at once: prompt, retrieved docs, conversation. Beyond it, things fall off.",
    say: "Bigger isn't free \u2014 cost and latency scale with tokens, and models get lost in the middle of long contexts. The design question isn't \u201chow big\u201d but \u201cwhat earns a place in the window.\u201d Good retrieval and compression beat dumping everything in.",
    push: "\u201cLong-context models kill RAG, right?\u201d No. Even with a huge window, stuffing everything in is slower, pricier, and less accurate than retrieving the right slice. RAG is about relevance, not just fitting."
  },
  tokens: {
    title: "Tokens",
    analogy: "You don't read \u201cdon't\u201d as d-o-n-'-t. Your brain chunks it into a meaningful unit. Models read in chunks called tokens, not letters or whole words.",
    technical: "Tokens are the sub-word units text is split into before the model sees it. Pricing, limits, and latency are all measured in tokens.",
    say: "Tokens are sub-word chunks \u2014 roughly \u00be of a word. They matter to a TPM because they are the cost and latency model: every prompt, retrieved doc, and response is billed in tokens. Cost optimization is largely token optimization.",
    push: "\u201cHow would you cut our LLM bill 30%?\u201d Token levers: cache repeated context, retrieve instead of stuffing, shorten system prompts, route easy calls to a smaller model. Lead with measurement \u2014 find where the tokens go first."
  },
  attention: {
    title: "Attention & Transformers",
    analogy: "Driving, a thousand things are in view \u2014 trees, signs, clouds. Your brain spends focus on the one that matters: brake lights ahead. Attention is deciding what deserves focus.",
    technical: "Transformers let every token weigh how much every other token matters to it \u2014 \u201cattention\u201d \u2014 in parallel. That's how the model knows \u201cit\u201d refers to the dog, not the bone.",
    say: "The breakthrough is attention: instead of reading strictly left-to-right, each token directly weighs every other token, in parallel. That's why it captures long-range meaning and trains efficiently on GPUs. I don't need the math \u2014 I need to explain why it beat what came before: parallelism and long-range context.",
    push: "\u201cWalk me through self-attention.\u201d Conceptually: each token asks \u201cwho's relevant to me?\u201d (query), everything answers (keys), answers get blended by relevance (values). Offer depth \u2014 don't drown them in it."
  },
  agents: {
    title: "Agents \u2014 and When Not To",
    analogy: "Building a house, you don't hire one person \u2014 architect, electrician, plumber, inspector, plus someone coordinating them. Multi-agent AI is the same. But to change a lightbulb, you don't convene the whole crew.",
    technical: "An agent plans, calls tools, observes results, and loops until a goal is met \u2014 autonomy, not a single response. Powerful, but harder to control and audit.",
    say: "The senior instinct is restraint: most \u201cagent\u201d problems are better as a deterministic workflow with tool calls \u2014 cheaper, testable, auditable. I reach for true agency only when the path can't be known in advance. In a regulated product, every bit of autonomy is extra surface to validate.",
    push: "\u201cWhy not make the whole thing agentic?\u201d Autonomy trades control for flexibility. Ask: do we need dynamic planning, or is this a known sequence? Unbounded agents are hard to test, cost more, and fail unpredictably."
  },
  evals: {
    title: "Evaluation & Groundedness",
    analogy: "You wouldn't ship a drug because it \u201cfelt\u201d effective \u2014 you'd run trials with defined endpoints. AI quality is the same: vibes aren't evidence. You need a measured rubric.",
    technical: "Evaluation measures quality across accuracy, groundedness, safety, latency, cost, and regressions \u2014 often with golden datasets and an LLM-as-judge scoring against criteria.",
    say: "You can't manage what you don't measure. I'd build a golden dataset of real cases with known-good answers, then track groundedness, accuracy, and regression on every change. LLM-as-judge scales scoring, but you calibrate it against human review \u2014 it's a tool, not the truth.",
    push: "\u201cHow do you know your RAG got worse?\u201d That's a regression-test question. Without a fixed eval set you're flying blind \u2014 every prompt tweak is a guess. Name the eval harness before the incident, not after."
  }
};

const cbWrap = document.getElementById('concept-buttons');
const detail = document.getElementById('concept-detail');
Object.keys(concepts).forEach((key, i) => {
  const b = document.createElement('button');
  b.textContent = concepts[key].title.split(' \u2014 ')[0].split(' & ')[0].replace('RAG vs. Fine-tuning','RAG vs FT');
  b.dataset.concept = key;
  b.addEventListener('click', () => {
    document.querySelectorAll('#concept-buttons button').forEach(x => x.classList.remove('is-active'));
    b.classList.add('is-active');
    const c = concepts[key];
    detail.innerHTML = `
      <h3>${c.title}</h3>
      <div class="row"><span class="lab">Everyday analogy</span><p>${c.analogy}</p></div>
      <div class="row"><span class="lab">Technical meaning</span><p>${c.technical}</p></div>
      <div class="row"><span class="lab say">Say this in an interview</span><p>${c.say}</p></div>
      <div class="row"><span class="lab push">When they push back</span><p>${c.push}</p></div>`;
  });
  cbWrap.appendChild(b);
});

/* -------------------------- DECISION FRAMEWORKS -------------------------- */
const frameworks = [
  {
    title: "Should I use RAG or fine-tune?",
    yes: "RAG when: knowledge changes often, needs auditability, is large, or must cite sources. Most enterprise document problems.",
    no: "Fine-tune when: you need a consistent behavior, format, or domain reasoning that prompting can't reliably produce.",
    ask: "Is the goal <b>knowledge</b> or <b>behavior</b>? What's the retraining and governance cost each time the data changes? Can a better prompt + retrieval get me there first?"
  },
  {
    title: "Should this be an agent?",
    yes: "Agent when: the path can't be known in advance, the task needs dynamic planning, or it genuinely branches based on intermediate results.",
    no: "Deterministic workflow when: the steps are known, output feeds compliance, or you need it cheap, testable, and auditable. (Most of the time.)",
    ask: "Do I actually need planning, or is this a fixed sequence with tool calls? How do I test and bound it? What's the blast radius if it loops or goes wrong?"
  }
];
const fw = document.getElementById('frameworks-wrap');
frameworks.forEach(f => {
  const el = document.createElement('div');
  el.className = 'frame';
  el.innerHTML = `
    <h3>${f.title}</h3>
    <div class="when">
      <div class="yes"><strong>Lean in</strong><br>${f.yes}</div>
      <div class="no"><strong>Hold back</strong><br>${f.no}</div>
    </div>
    <div class="ask"><strong>Questions to ask first:</strong> ${f.ask}</div>`;
  fw.appendChild(el);
});

/* ----------------------------- PROGRAM / TPM ----------------------------- */
const program = [
  {
    cat: "prog", q: "\u201cWe want to upgrade from GPT-4 to GPT-5 across the org. How do you run this program?\u201d",
    a: "<p><strong>Frame it as a program, not a swap.</strong> 1) Baseline current behavior with a fixed eval set so I have a before/after. 2) Run the new model in shadow / canary on real traffic. 3) Compare on the golden dataset, plus cost and latency \u2014 watch for silent regressions and prompt sensitivity. 4) Staged rollout (internal \u2192 small % \u2192 full) with a one-switch rollback. 5) Comms: tell stakeholders what changes, what to watch, the fallback. 6) Monitor post-launch with the same evals.</p><p>The Principal signal: I don't trust \u201cnewer = better.\u201d I prove it on our data before anyone's workflow depends on it.</p>"
  },
  {
    cat: "prog", q: "\u201cYour RAG accuracy dropped from 93% to 72% overnight. How do you debug it?\u201d",
    a: "<p>Isolate the layer before guessing. Did the <strong>model</strong> change (provider update)? <strong>Retrieval</strong> \u2014 are embeddings stale, did chunking or metadata filters change, is the reranker failing? <strong>Context</strong> \u2014 too long, lost in the middle? <strong>Prompt</strong> \u2014 did anyone touch it? <strong>Eval</strong> \u2014 is the drop real or a measurement change? I'd bisect with the golden dataset to localize, not theorize. The lesson I'd name: this is why you version prompts, pin models, and run regression tests.</p>"
  },
  {
    cat: "prog", q: "\u201cHow do you govern AI cost as usage scales?\u201d",
    a: "<p>Cost is token cost. Levers: cache repeated context, retrieve instead of stuffing, route easy calls to a smaller model, cap context, batch where latency allows. But governance is measurement first \u2014 per-feature token attribution so you know where spend goes, budgets/alerts per workload, and a model-routing policy. Then optimize the biggest line, not the loudest one.</p>"
  },
  {
    cat: "prog", q: "\u201cHow do you decide build vs. buy for an AI capability?\u201d",
    a: "<p>Buy the commodity, build the differentiator. If a capability is undifferentiated infra (vector DB, gateway, eval tooling), buy or use open source \u2014 speed matters more than control. Build where it's your moat or your data/compliance posture is the edge. Re-evaluate over time: things commoditize fast, and the real risk is usually distribution and bundling, not raw capability.</p>"
  }
];

/* ---------------------------- SYSTEM DESIGN ------------------------------ */
const sysSteps = [
  ["Clarify requirements & constraints", "Who are the users? Scale, latency budget, accuracy bar, compliance (HIPAA / audit)? Pin these before drawing anything."],
  ["Define success metrics", "What does \u201cgood\u201d mean here, measurably? Groundedness, task completion, cost per request, p95 latency."],
  ["High-level architecture", "Sketch the spine: ingest \u2192 retrieve \u2192 reason \u2192 validate \u2192 serve. Keep it boring and legible first."],
  ["Drill into the hard component", "Pick the one part that actually decides success (usually retrieval quality or extraction accuracy) and go deep."],
  ["Name the trade-offs", "Build vs buy, RAG vs fine-tune, agent vs workflow, sync vs streaming. Show you chose, and why."],
  ["Failure modes & guardrails", "What breaks? Hallucination, retrieval miss, prompt injection, PII leakage. How do you detect and contain each?"],
  ["Scale & cost", "Where's the bottleneck at 10x? Caching, async, smaller models, token budget. Tie back to the cost model."],
  ["Governance & audit", "Who can access what, how is it logged, can you reconstruct any answer's sources? Critical in regulated domains."]
];
const ss = document.getElementById('sysdesign-steps');
sysSteps.forEach(([t, d]) => {
  const li = document.createElement('li');
  li.innerHTML = `<div><b>${t}</b><span>${d}</span></div>`;
  ss.appendChild(li);
});
["Design an AI healthcare assistant","Design an AI gateway","Design a document extraction system","Design an AI search engine","Design a multi-agent safety workflow"]
  .forEach(x => { const s = document.createElement('span'); s.textContent = x; document.getElementById('sysdesign-examples').appendChild(s); });

/* --------------------------- STORY SCAFFOLD ------------------------------ */
/* The honest centerpiece: prompts that extract YOUR real architecture.      */
const altitudes = [
  { key:"a30",  label:"30-second version (the exec answer)", q:"What does it do, who's it for, and the one hard problem you solved? No jargon." },
  { key:"a3m",  label:"2\u20133 minute version (architecture + judgment)", q:"The key decisions and WHY. RAG vs fine-tune? Agent vs workflow? The design choice you'd lead with." },
  { key:"awb",  label:"Whiteboard version", q:"Data flow and components. Where does it scale? Where does it break?" },
  { key:"atr",  label:"Trade-offs & failure modes", q:"What you'd do differently, what you deliberately didn't build, and what keeps you up at night." }
];
const scaffolds = [
  { id:"aethersignal", name:"AetherSignal", sub:"Pharmacovigilance / adverse-event detection. Your strongest Principal-level signal.",
    spark:"Lead prompt: what are the four agents, actually \u2014 and where did you keep the pipeline deterministic instead of agentic?" },
  { id:"medicaldiary", name:"MedicalDiary", sub:"Voice-first clinical intake. Your product/UX range story.",
    spark:"Lead prompt: how does it match a parent's free-text symptom to a known pathway \u2014 and where do safety red-flags override the model?" },
  { id:"intake", name:"Corporate Safety Intake", sub:"Source ingestion, extraction, follow-up orchestration, routing.",
    spark:"Lead prompt: which steps are true agent-like autonomy vs. a fixed workflow \u2014 and why draw the line there?" }
];

const SKEY = "athena_scaffold_v1";
function loadStore(){ try { return JSON.parse(localStorage.getItem(SKEY)) || {}; } catch(e){ return {}; } }
function saveStore(o){ try { localStorage.setItem(SKEY, JSON.stringify(o)); return true; } catch(e){ return false; } }
let store = loadStore();

const scWrap = document.getElementById('scaffold-wrap');
scaffolds.forEach(sc => {
  const el = document.createElement('div');
  el.className = 'scaffold';
  let altsHtml = altitudes.map(alt => {
    const val = (store[sc.id] && store[sc.id][alt.key]) ? store[sc.id][alt.key] : "";
    return `<div class="alt">
        <label>${alt.label}</label>
        <p class="q">\u2192 ${alt.q}</p>
        <textarea data-sys="${sc.id}" data-alt="${alt.key}" placeholder="Type your answer\u2026">${val.replace(/</g,'&lt;')}</textarea>
      </div>`;
  }).join('');
  el.innerHTML = `
    <h3>${sc.name}</h3>
    <p class="sub">${sc.sub}</p>
    <div class="ask" style="background:#fff;border:1px dashed var(--clay);color:var(--clay);border-radius:14px;padding:12px 14px;font-size:13px;margin-bottom:16px;">${sc.spark}</div>
    ${altsHtml}
    <div class="save-row">
      <button class="button secondary" data-save="${sc.id}">Save ${sc.name}</button>
      <span class="saved-flag" id="flag-${sc.id}">Saved to this browser \u2713</span>
    </div>`;
  scWrap.appendChild(el);
});
scWrap.addEventListener('input', e => {
  if (e.target.tagName === 'TEXTAREA') {
    const sys = e.target.dataset.sys, alt = e.target.dataset.alt;
    store[sys] = store[sys] || {};
    store[sys][alt] = e.target.value;
  }
});
scWrap.addEventListener('click', e => {
  const id = e.target.dataset.save;
  if (!id) return;
  const ok = saveStore(store);
  const flag = document.getElementById('flag-' + id);
  flag.textContent = ok ? "Saved to this browser \u2713" : "Couldn't save (private/incognito?)";
  flag.classList.add('show');
  setTimeout(() => flag.classList.remove('show'), 2200);
});

/* ----------------------------- INTERVIEW MODE ---------------------------- */
const interview = [
  { cat:"concept", lab:"Concept", q:"Explain embeddings to a CEO, then to an engineer.", a:"<p><strong>CEO:</strong> it's how the system understands that \u201chigh fever\u201d and \u201ctemp 103\u201d mean the same thing, so search works on meaning, not exact words. <strong>Engineer:</strong> we encode text into vectors and rank by cosine similarity, usually inside a hybrid retriever with a reranker. Same idea, two altitudes \u2014 showing you can flex is the point.</p>" },
  { cat:"dec", lab:"Decision", q:"A team wants to fine-tune on 10k support tickets. What do you ask?", a:"<p>Is the goal knowledge (use RAG) or behavior/tone (maybe fine-tune)? What's the retraining and governance cost each time the data changes? Have we exhausted prompting + retrieval first? I'd start with RAG, measure the gaps, and fine-tune only those.</p>" },
  { cat:"prog", lab:"Program", q:"How do you run a model upgrade across the org?", a:"<p>Baseline with a fixed eval set, shadow/canary the new model, compare on golden data + cost + latency, staged rollout with rollback, stakeholder comms, post-launch monitoring. I prove \u201cbetter\u201d on our data before anyone depends on it.</p>" },
  { cat:"sys", lab:"System Design", q:"Design an AI healthcare assistant.", a:"<p>Run the spine: clarify users/scale/compliance \u2192 success metrics (groundedness, safety) \u2192 ingest/retrieve/reason/validate/serve \u2192 drill into retrieval quality and the safety guardrail layer \u2192 trade-offs (deterministic pathways vs. open generation) \u2192 failure modes (hallucination, missed red-flag) \u2192 audit trail. Anchor it in a real system you've built.</p>" },
  { cat:"dec", lab:"Decision", q:"Why not make the whole product agentic?", a:"<p>Autonomy trades control for flexibility. Most of it is a known sequence \u2014 better as a deterministic workflow with tool calls: cheaper, testable, auditable. I reserve true agency for where the path genuinely can't be known in advance, and bound it hard when output feeds compliance.</p>" },
  { cat:"concept", lab:"Concept", q:"Does RAG eliminate hallucinations?", a:"<p>No \u2014 and claiming it does is a tell. RAG reduces them by grounding answers in retrieved sources, but the model can still ignore or misread context, and retrieval itself can miss. You manage it with reranking, citation-checking, and a real eval harness.</p>" },
  { cat:"prog", lab:"Behavioral", q:"Tell me about a hard technical call you made under uncertainty.", a:"<p>Use a real one from your own systems (e.g., phasing the extraction pipeline: Vision MVP first, owning more of the stack only when volume and the error profile justified it). Structure: the tension \u2192 the options \u2192 what you chose \u2192 why \u2192 what you'd revisit. The judgment, not the outcome, is what they're scoring.</p>" }
];
const iw = document.getElementById('interview-wrap');
interview.forEach(item => {
  const d = document.createElement('details');
  d.className = 'qa';
  d.innerHTML = `<summary style="list-style:none"><button type="button"><span class="cat ${item.cat}">${item.lab}</span>${item.q}<span class="chev">\u25b8</span></button></summary><div class="ans">${item.a}</div>`;
  // make the whole summary toggle (button is decorative inside summary)
  d.querySelector('button').addEventListener('click', ev => { ev.preventDefault(); d.open = !d.open; });
  iw.appendChild(d);
});
