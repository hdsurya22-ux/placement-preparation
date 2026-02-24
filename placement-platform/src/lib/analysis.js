export const STORAGE_KEY = "placement-readiness-history-v1";

export const SKILL_CATEGORIES = {
  coreCs: {
    label: "Core CS",
    skills: ["DSA", "OOP", "DBMS", "OS", "Networks"]
  },
  languages: {
    label: "Languages",
    skills: [
      "Java",
      "Python",
      "JavaScript",
      "TypeScript",
      "C",
      "C++",
      "C#",
      "Go"
    ]
  },
  web: {
    label: "Web",
    skills: ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL"]
  },
  data: {
    label: "Data",
    skills: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis"]
  },
  cloudDevops: {
    label: "Cloud/DevOps",
    skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"]
  },
  testing: {
    label: "Testing",
    skills: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest"]
  }
};

const SKILL_PATTERNS = {
  DSA: [/\bdsa\b/i, /\bdata structures?\b/i, /\balgorithms?\b/i],
  OOP: [/\boop\b/i, /\bobject[\s-]?oriented\b/i],
  DBMS: [/\bdbms\b/i, /\bdatabase management\b/i],
  OS: [/\bos\b/i, /\boperating systems?\b/i],
  Networks: [/\bnetworks?\b/i, /\bnetworking\b/i],
  Java: [/\bjava\b/i],
  Python: [/\bpython\b/i],
  JavaScript: [/\bjavascript\b/i, /\bjs\b/i],
  TypeScript: [/\btypescript\b/i, /\bts\b/i],
  C: [/\bc language\b/i, /(?:^|[\s(])c(?:[\s),./]|$)/i],
  "C++": [/\bc\+\+\b/i],
  "C#": [/\bc#\b/i, /\bc sharp\b/i],
  Go: [/\bgolang\b/i, /(?:^|[\s(])go(?:[\s),./]|$)/i],
  React: [/\breact(?:\.js)?\b/i],
  "Next.js": [/\bnext(?:\.js)?\b/i],
  "Node.js": [/\bnode(?:\.js)?\b/i],
  Express: [/\bexpress(?:\.js)?\b/i],
  REST: [/\brest\b/i, /\brestful\b/i, /\brest api\b/i],
  GraphQL: [/\bgraphql\b/i],
  SQL: [/\bsql\b/i, /\bstructured query language\b/i],
  MongoDB: [/\bmongodb\b/i, /\bmongo\b/i],
  PostgreSQL: [/\bpostgresql\b/i, /\bpostgres\b/i],
  MySQL: [/\bmysql\b/i],
  Redis: [/\bredis\b/i],
  AWS: [/\baws\b/i, /\bamazon web services\b/i],
  Azure: [/\bazure\b/i],
  GCP: [/\bgcp\b/i, /\bgoogle cloud\b/i],
  Docker: [/\bdocker\b/i],
  Kubernetes: [/\bkubernetes\b/i, /\bk8s\b/i],
  "CI/CD": [/\bci\/cd\b/i, /\bcontinuous integration\b/i],
  Linux: [/\blinux\b/i],
  Selenium: [/\bselenium\b/i],
  Cypress: [/\bcypress\b/i],
  Playwright: [/\bplaywright\b/i],
  JUnit: [/\bjunit\b/i],
  PyTest: [/\bpytest\b/i, /\bpy\.?test\b/i]
};

const QUESTION_TEMPLATES = {
  DSA: "How would you optimize search in sorted data and why?",
  OOP: "How would you apply SOLID principles in a real feature implementation?",
  DBMS: "How would you design tables for consistency and query performance in DBMS?",
  OS: "What happens during a context switch and when does it impact performance?",
  Networks:
    "How does TCP differ from UDP, and where would you choose each in applications?",
  Java: "What is the difference between JVM, JRE, and JDK in Java development?",
  Python:
    "When would you choose list comprehension vs generator expressions in Python?",
  JavaScript:
    "How do closures work in JavaScript, and where can they cause bugs?",
  TypeScript:
    "How do union types and generics improve reliability in a TypeScript codebase?",
  C: "How do pointers and memory allocation choices affect C program safety?",
  "C++":
    "When would you use smart pointers in C++, and which type would you choose?",
  "C#": "How does async/await work in C#, and what are common pitfalls?",
  Go: "How do goroutines and channels help with concurrency in Go services?",
  React: "Explain state management options in React and when to choose each.",
  "Next.js": "When should you use SSR, SSG, or ISR in a Next.js application?",
  "Node.js": "How does the Node.js event loop handle concurrency for I/O-heavy APIs?",
  Express:
    "How would you structure middleware in Express for auth, validation, and errors?",
  REST: "How do you design versioned REST APIs without breaking existing clients?",
  GraphQL: "What are GraphQL N+1 query issues, and how would you prevent them?",
  SQL: "Explain indexing in SQL and when it helps or hurts performance.",
  MongoDB:
    "When would you embed vs reference documents in MongoDB schema design?",
  PostgreSQL:
    "How would you use Postgres transactions and constraints for data integrity?",
  MySQL: "How would you tune a slow MySQL query using EXPLAIN output?",
  Redis:
    "Which Redis data structures would you use for caching, rate limiting, and queues?",
  AWS: "Which AWS services would you combine to deploy and monitor a web app?",
  Azure:
    "How would you design a basic Azure deployment pipeline for a web service?",
  GCP: "How would you deploy and observe an app on GCP for production readiness?",
  Docker: "How would you write a production-ready Dockerfile for a Node or Python app?",
  Kubernetes: "How do Pods, Deployments, and Services work together in Kubernetes?",
  "CI/CD":
    "How would you design a CI/CD pipeline with tests, linting, and safe deployment?",
  Linux: "Which Linux commands do you use most for debugging app and server issues?",
  Selenium: "How would you make Selenium UI tests stable in dynamic web pages?",
  Cypress:
    "What kinds of tests fit Cypress best, and how do you keep them deterministic?",
  Playwright:
    "How do Playwright fixtures improve end-to-end test maintainability?",
  JUnit:
    "How do you structure JUnit test classes for readable and maintainable test suites?",
  PyTest:
    "How do fixtures and parametrization in PyTest reduce duplicate test code?"
};

function hasSkill(text, skill) {
  const patterns = SKILL_PATTERNS[skill] || [];
  return patterns.some((pattern) => pattern.test(text));
}

function createSkillQuestion(skill) {
  return QUESTION_TEMPLATES[skill] || null;
}

export function extractSkills(jdText) {
  const text = jdText || "";
  const categories = {};

  Object.entries(SKILL_CATEGORIES).forEach(([key, cfg]) => {
    categories[key] = cfg.skills.filter((skill) => hasSkill(text, skill));
  });

  const categoriesPresent = Object.entries(categories)
    .filter(([, list]) => list.length > 0)
    .map(([key]) => key);

  const hasAny = categoriesPresent.length > 0;

  return {
    categories,
    categoriesPresent,
    hasAny,
    fallbackLabel: hasAny ? null : "General fresher stack"
  };
}

export function computeReadinessScore({
  categoriesPresent,
  company,
  role,
  jdText
}) {
  let score = 35;

  const categoryBonus = Math.min(categoriesPresent.length, 6) * 5;
  score += categoryBonus;

  if (company && company.trim().length > 0) score += 10;
  if (role && role.trim().length > 0) score += 10;
  if ((jdText || "").length > 800) score += 10;

  return Math.min(100, score);
}

export function buildChecklist(extracted) {
  const hasCore = extracted.categoriesPresent.includes("coreCs");
  const hasDSA = extracted.categories.coreCs?.includes("DSA");
  const hasLanguages = extracted.categoriesPresent.includes("languages");
  const hasWeb = extracted.categoriesPresent.includes("web");
  const hasData = extracted.categoriesPresent.includes("data");
  const hasCloud = extracted.categoriesPresent.includes("cloudDevops");
  const hasTesting = extracted.categoriesPresent.includes("testing");

  return [
    {
      round: "Round 1: Aptitude / Basics",
      items: [
        "Revise quantitative aptitude (time & work, percentages, probability).",
        hasLanguages
          ? `Brush up ${extracted.categories.languages.slice(0, 2).join(" / ")} syntax and basics.`
          : "Brush up one primary language syntax and problem-solving basics.",
        hasCore
          ? "Review core CS basics highlighted in the JD."
          : "Cover high-level basics of DBMS, OS, and networking.",
        "Prepare a concise self-introduction aligned with the role.",
        "Practice 2-3 short online assessments in exam-like timing."
      ]
    },
    {
      round: "Round 2: DSA + Core CS",
      items: [
        hasDSA
          ? "Solve problems on arrays, strings, hash maps, and recursion."
          : "Practice at least 10 easy-medium coding problems.",
        hasDSA
          ? "Revise common patterns: sliding window, two pointers, DP basics."
          : "Revisit Big-O complexity and data structure trade-offs.",
        hasCore
          ? "Review OS, DBMS, and networking topics emphasized in the JD."
          : "Cover basic OS, DBMS, and networking interview topics.",
        hasData
          ? "Prepare explanations for SQL joins, indexing, and transactions."
          : "Review basic SQL queries: SELECT, JOIN, GROUP BY, ORDER BY.",
        hasCloud
          ? "Map one backend problem to a cloud deployment approach."
          : "Be ready to walk through your code and explain design decisions."
      ]
    },
    {
      round: "Round 3: Tech interview (projects + stack)",
      items: [
        "Shortlist 2-3 projects you can explain confidently end-to-end.",
        hasWeb
          ? "Revise stack topics from the JD: components, APIs, and state/data flow."
          : "Rehearse how your projects use the stack mentioned in the JD.",
        hasCloud
          ? "Review how you would deploy apps on AWS/Azure/GCP and basic services."
          : "Think about how you would deploy your project to production.",
        hasTesting
          ? "Prepare how you would write and run automated tests for your code."
          : "Be ready to discuss how you test and debug your code.",
        hasData
          ? "Prepare schema and query optimization decisions from your project."
          : "Prepare one performance optimization from a project.",
        "Practice explaining trade-offs and alternatives when asked why."
      ]
    },
    {
      round: "Round 4: Managerial / HR",
      items: [
        "Prepare examples for teamwork, conflict resolution, and ownership.",
        "Clarify your preferences: role fit, location, and stack.",
        "Align your strengths and learning goals with the company's work.",
        "Prepare 3-4 thoughtful questions to ask the interviewer.",
        "Review your resume line-by-line so there are no surprises."
      ]
    }
  ];
}

export function buildPlan(extracted) {
  const webSkills = extracted.categories.web || [];
  const dataSkills = extracted.categories.data || [];
  const cloudSkills = extracted.categories.cloudDevops || [];
  const testingSkills = extracted.categories.testing || [];
  const languageSkills = extracted.categories.languages || [];
  const hasWeb = extracted.categoriesPresent.includes("web");
  const hasData = extracted.categoriesPresent.includes("data");
  const hasCloud = extracted.categoriesPresent.includes("cloudDevops");
  const hasTesting = extracted.categoriesPresent.includes("testing");
  const hasDSA = extracted.categories.coreCs?.includes("DSA");

  return [
    {
      day: "Day 1",
      focus: "Basics + Core CS",
      items: [
        languageSkills.length
          ? `Review ${languageSkills.slice(0, 2).join(" / ")} fundamentals and syntax.`
          : "Review programming basics and one primary language syntax.",
        "Cover OS and DBMS fundamentals at overview level.",
        hasData
          ? `Spend 60 minutes on ${dataSkills.slice(0, 2).join(" / ")} fundamentals and queries.`
          : "Attempt 2-3 mixed aptitude + basic coding questions."
      ]
    },
    {
      day: "Day 2",
      focus: "Basics + Core CS",
      items: [
        "Deepen understanding of DBMS, indexing, and transactions.",
        "Revise networking and OS concepts often asked in interviews.",
        hasCloud
          ? `Revise deployment basics for ${cloudSkills.slice(0, 2).join(" / ")}.`
          : "Solve one timed aptitude set to simulate Round 1."
      ]
    },
    {
      day: "Day 3",
      focus: "DSA + coding practice",
      items: [
        hasDSA
          ? "Solve 4-6 medium DSA problems on arrays, strings, and hash maps."
          : "Solve 4-6 easy problems to build coding fluency.",
        "For each problem, write down your approach and complexity.",
        "Revisit at least one previously solved problem without looking."
      ]
    },
    {
      day: "Day 4",
      focus: "DSA + coding practice",
      items: [
        hasDSA
          ? "Focus on recursion, DP, and sorting-based problems."
          : "Attempt 2-3 new patterns (two pointers, sliding window).",
        "Practice explaining your solution out loud as if in an interview.",
        "Do one timed coding round to improve speed and clarity."
      ]
    },
    {
      day: "Day 5",
      focus: "Project + resume alignment",
      items: [
        hasWeb
          ? "Walk through your web project architecture, APIs, and state handling."
          : "Prepare detailed explanation for one flagship project.",
        hasWeb
          ? `Revise ${webSkills.slice(0, 2).join(" / ")} topics from your projects.`
          : "Align your project description with the stack in the JD.",
        "Update resume bullets to reflect measurable outcomes.",
        hasTesting
          ? `Add test strategy notes for ${testingSkills.slice(0, 2).join(" / ")}.`
          : "Add one testing and debugging example from your project."
      ]
    },
    {
      day: "Day 6",
      focus: "Mock interview questions",
      items: [
        "Run one mock DSA session and one project discussion session.",
        "Record yourself answering 5-7 technical questions from this plan.",
        "Note weak spots and create a final revision list."
      ]
    },
    {
      day: "Day 7",
      focus: "Revision + weak areas",
      items: [
        "Revisit 3-5 concepts you found difficult during the week.",
        hasData
          ? "Do a quick pass over SQL and data storage questions."
          : "Review key CS topics most relevant to this JD.",
        hasWeb
          ? "Do a final frontend/backend revision of component flow and API handling."
          : "Revisit one coding round strategy for confidence.",
        "Sleep well and avoid heavy new topics on the final day."
      ]
    }
  ];
}

export function buildQuestions(extracted) {
  const questions = [];
  const allSkills = Object.values(extracted.categories).flat();

  allSkills.forEach((skill) => {
    const question = createSkillQuestion(skill);
    if (question && !questions.includes(question)) {
      questions.push(question);
    }
  });

  const fallback = [
    "How would you explain one project architecture decision and its trade-offs?",
    "Which part of your resume best matches this role, and why?",
    "Describe a bug you diagnosed systematically from symptom to fix.",
    "How do you break down an unknown coding problem in an interview?",
    "What changes would you make first after receiving code review feedback?",
    "How would you balance correctness and speed in a timed coding round?",
    "How would you prioritize features if given one week to improve your project?",
    "How do you justify one trade-off you made between simplicity and scalability?",
    "Which module in your project is most error-prone and how would you harden it?",
    "How would you validate your final solution before saying it is production-ready?"
  ];

  if (!questions.length) {
    questions.push(
      "For a general fresher stack, how would you prioritize DSA, Core CS, and one project?"
    );
  }

  fallback.forEach((q) => {
    if (questions.length < 10 && !questions.includes(q)) {
      questions.push(q);
    }
  });

  fallback.forEach((q) => {
    if (questions.length < 10 && !questions.includes(q)) {
      questions.push(q);
    }
  });

  return questions.slice(0, 10);
}

export function loadHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveHistory(entries) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore quota / serialization errors
  }
}
