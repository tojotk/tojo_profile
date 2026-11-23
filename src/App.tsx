import { useEffect, useState, type ReactNode } from "react";
import Scene from "./components/Scene";
import { Icon, Reveal, SectionHeader, Tilt } from "./components/ui";

const NAV_LINKS = ["About", "Services", "Skills", "Projects", "Experience", "Profile", "Contact", "" , "" , "" , ""] as const;

const MARQUEE = [
  "Python",
  "Django",
  "Machine Learning",
  "Deep Learning",
  "Computer Vision",
  "NLP",
  "Generative AI",
  "RAG",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Jupyter",
  "MySQL",
  "JavaScript",
  "HTML5 / CSS3",
  "PHP",
  "Java",
  "Git & GitHub",
];

const SERVICES = [
  {
    icon: Icon.Cpu,
    number: "01",
    title: "AI & Machine Learning",
    subtitle: "Intelligent systems from data to prediction",
    text: "Designing practical machine learning solutions from data preprocessing and feature engineering to model training, evaluation, optimization and deployment.",
    tags: [
      "Python",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Model Evaluation",
    ],
  },
  {
    icon: Icon.Layers,
    number: "02",
    title: "Generative AI & LLM",
    subtitle: "Context-aware AI with modern language models",
    text: "Building intelligent applications using LLMs, embeddings and retrieval pipelines to deliver contextual and useful AI experiences.",
    tags: [
      "LLMs",
      "RAG",
      "Embeddings",
      "FAISS",
      "Prompt Engineering",
    ],
  },
  {
    icon: Icon.Code,
    number: "03",
    title: "Computer Vision & NLP",
    subtitle: "AI that understands images and language",
    text: "Developing AI solutions for image classification, computer vision, text classification, sentiment analysis and intelligent information processing.",
    tags: [
      "OpenCV",
      "CNN",
      "TensorFlow",
      "NLP",
      "Transformers",
    ],
  },
  {
    icon: Icon.Database,
    number: "04",
    title: "AI Application Development",
    subtitle: "Turning AI models into real products",
    text: "Integrating machine learning and AI workflows into complete applications with APIs, databases and responsive user interfaces.",
    tags: [
      "FastAPI",
      "Django",
      "REST APIs",
      "MySQL",
      "React",
    ],
  },
  {
    icon: Icon.Code,
    number: "05",
    title: "Full-Stack Development",
    subtitle: "Modern applications from frontend to backend",
    text: "Building responsive full-stack applications with Python backends, modern frontend technologies, database integration and clean API architecture.",
    tags: [
      "Python",
      "React",
      "JavaScript",
      "Django",
      "Tailwind CSS",
    ],
  },
  {
    icon: Icon.Tool,
    number: "06",
    title: "Deployment & Integration",
    subtitle: "From development to accessible applications",
    text: "Connecting applications, APIs, repositories and deployment platforms to turn development work into maintainable and accessible products.",
    tags: [
      "Git",
      "GitHub",
      "Vercel",
      "Netlify",
      "API Integration",
    ],
  },
];

const FEATURED_PROJECTS = [
  {
    number: "01",
    title: "Skinova",
    subtitle: "AI-Powered Dermatological Screening Platform",
    category: "Computer Vision • Generative AI • Full-Stack",
    text: "An AI-powered dermatological screening platform combining deep-learning image classification with retrieval-augmented generation. The system uses an EfficientNet-B0 model to classify skin-condition images across seven classes based on the HAM10000 taxonomy, while a RAG pipeline uses FAISS and SentenceTransformers to provide grounded dermatological information.",
    impact:
      "Designed as an end-to-end AI application connecting computer vision, retrieval, backend APIs and a modern frontend.",
    tags: [
      "EfficientNet-B0",
      "Computer Vision",
      "RAG",
      "FAISS",
      "FastAPI",
      "React",
    ],
    href: "https://github.com/tojotk/Skinova_AI_skin_disease_detection",
    featured: true,
  },

  {
    number: "02",
    title: "Fake vs Real News Detection",
    subtitle: "NLP-Based News Classification System",
    category: "Natural Language Processing • Machine Learning",
    text: "A natural language processing system developed to classify news articles as real or fake. The pipeline applies text preprocessing and TF-IDF feature extraction before evaluating multiple supervised learning approaches including Logistic Regression, Naive Bayes and Linear SVM.",
    impact:
      "The selected classification workflow was integrated into a Streamlit application, transforming the machine-learning pipeline into an interactive user-facing tool.",
    tags: [
      "Python",
      "NLP",
      "TF-IDF",
      "Logistic Regression",
      "Linear SVM",
      "Streamlit",
    ],
    href: "https://github.com/tojotk/fake_vs_real_news_detection",
    featured: false,
  },

  {
    number: "03",
    title: "AI Smart Fisheries Surveillance",
    subtitle: "Intelligent Marine Monitoring Application",
    category: "Computer Vision • Full-Stack • AI",
    text: "An AI-powered surveillance concept designed to support marine monitoring, illegal-fishing detection and emergency response. The project combines an AI-driven monitoring workflow with frontend, backend and database components in a unified application architecture.",
    impact:
      "Demonstrates the ability to move beyond isolated machine-learning models and design AI functionality as part of a complete software system.",
    tags: [
      "Computer Vision",
      "Artificial Intelligence",
      "Full-Stack",
      "Django",
      "MySQL",
    ],
    href: "https://github.com/tojotk/smart_fisheries",
    featured: false,
  },

  {
    number: "04",
    title: "Adult Income Prediction",
    subtitle: "Supervised Machine Learning Pipeline",
    category: "Machine Learning • Data Science • Classification",
    text: "An end-to-end supervised learning project using approximately 48,000 records from the UCI Adult Census dataset to predict whether an individual's annual income exceeds $50K.",
    impact:
      "The workflow covers data cleaning, categorical feature encoding, model development and comparative evaluation across classification algorithms.",
    tags: [
      "Python",
      "Pandas",
      "Scikit-learn",
      "Classification",
      "Data Preprocessing",
    ],
    href: "https://github.com/tojotk",
    featured: false,
  },

  {
    number: "05",
    title: "IMDb Sentiment Analysis",
    subtitle: "Movie Review Sentiment Classification",
    category: "NLP • Text Classification • Machine Learning",
    text: "A natural language processing project developed to classify 50,000 IMDb movie reviews as positive or negative. The system applies text preprocessing and vectorization to transform unstructured review data into machine-learning features.",
    impact:
      "Demonstrates practical experience with text preprocessing, feature representation and supervised sentiment-classification workflows.",
    tags: [
      "Python",
      "NLP",
      "Text Classification",
      "Vectorization",
      "Scikit-learn",
    ],
    href: "https://github.com/tojotk",
    featured: false,
  },
];

const PIPELINE = [
  { icon: Icon.Database, label: "Data", text: "Collect, clean & explore" },
  { icon: Icon.Cpu, label: "Model", text: "Train & evaluate" },
  { icon: Icon.Code, label: "Backend", text: "Django & MySQL" },
  { icon: Icon.Layers, label: "Interface", text: "Responsive web UI" },
];

const SKILLS = [
  {
    category: "AI & Machine Learning",
    icon: Icon.Cpu,
    items: [
      "Machine Learning",
      "Supervised Learning",
      "Unsupervised Learning",
      "Regression",
      "Classification",
      "Clustering",
      "Feature Engineering",
      "Feature Selection",
      "Model Training",
      "Model Evaluation",
      "Cross Validation",
      "Hyperparameter Tuning",
      "Scikit-learn",
    ],
  },
  {
    category: "Deep Learning & Computer Vision",
    icon: Icon.Layers,
    items: [
      "Deep Learning",
      "Neural Networks",
      "CNN",
      "Transfer Learning",
      "EfficientNet",
      "TensorFlow",
      "Keras",
      "PyTorch",
      "OpenCV",
      "Computer Vision",
      "Image Classification",
      "Image Processing",
      "Object Detection",
    ],
  },
  {
    category: "Generative AI & LLM",
    icon: Icon.Cpu,
    items: [
      "Generative AI",
      "Large Language Models",
      "LLM Integration",
      "RAG",
      "Retrieval-Augmented Generation",
      "Prompt Engineering",
      "Embeddings",
      "Vector Search",
      "FAISS",
      "Sentence Transformers",
      "AI Agents",
      "AI Application Development",
    ],
  },
  {
    category: "Natural Language Processing",
    icon: Icon.Code,
    items: [
      "NLP",
      "Text Preprocessing",
      "Tokenization",
      "Text Classification",
      "Sentiment Analysis",
      "TF-IDF",
      "Word Embeddings",
      "Semantic Search",
      "Transformer Models",
      "BERT",
      "NLP Pipelines",
    ],
  },
  {
    category: "Data Science & Analytics",
    icon: Icon.Database,
    items: [
      "Python",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Seaborn",
      "Exploratory Data Analysis",
      "Data Preprocessing",
      "Data Cleaning",
      "Statistical Analysis",
      "Descriptive Statistics",
      "Outlier Detection",
      "Data Visualization",
      "SQL",
    ],
  },
  {
    category: "Full-Stack Development",
    icon: Icon.Code,
    items: [
      "Full-Stack Development",
      "React",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Responsive Web Design",
      "REST APIs",
      "Frontend Development",
      "Backend Development",
      "API Integration",
    ],
  },
  {
    category: "Backend, APIs & Databases",
    icon: Icon.Database,
    items: [
      "Python",
      "FastAPI",
      "Django",
      "Django REST Framework",
      "REST API Development",
      "API Design",
      "MySQL",
      "SQL",
      "Database Design",
      "CRUD Operations",
      "Authentication",
      "JSON",
    ],
  },
  {
    category: "Developer Tools & Deployment",
    icon: Icon.Tool,
    items: [
      "Git",
      "GitHub",
      "GitHub API",
      "VS Code",
      "PyCharm",
      "Jupyter Notebook",
      "Postman",
      "Virtual Environments",
      "pip",
      "Vercel",
      "Netlify",
      "Linux",
    ],
  },
];

const EXPERIENCE = [
  {
    period: "Nov 2025 — Dec 2025",
    role: "Python Intern",
    company: "Regional Technologies, Calicut",
    text: "Developed Python applications through practical, task-based assignments while strengthening debugging, logical reasoning and software development skills under mentorship.",
  },
  {
    period: "2024 — 2026",
    role: "College Media Head",
    company: "St. Benedict's College",
    text: "Led a student media team covering campus events, coordinating people, communication and creative delivery across college activities.",
  },
];

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language?: string | null;
  stargazers_count?: number;
  fork?: boolean;
};

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  PHP: "#8892bf",
  HTML: "#e34c26",
  CSS: "#7c5ac8",
  "Jupyter Notebook": "#DA5B0B",
};

export default function App() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [repoState, setRepoState] = useState<"loading" | "ready" | "error">("loading");

  /* GitHub repos */
  useEffect(() => {
    const ctrl = new AbortController();
    fetch("https://api.github.com/users/tojotk/repos?per_page=20&sort=updated", { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: Repo[]) => {
        setRepos(data);
        setRepoState("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Failed to fetch GitHub repos:", err);
        setRepoState("error");
      });
    return () => ctrl.abort();
  }, []);

  /* scroll spy */
  useEffect(() => {
    const els = NAV_LINKS.map((l) => document.getElementById(l.toLowerCase())).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-200">
      <Scene activeIndex={active} />

      {/* ================= Navbar ================= */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={`glass flex w-full max-w-4xl items-center justify-between rounded-full py-2 pl-5 pr-2 transition-all duration-300 ${
            scrolled ? "shadow-2xl shadow-black/50" : ""
          }`}
          aria-label="Primary"
        >
          <button onClick={() => go("about")} className="font-display text-lg font-bold tracking-tight text-white" aria-label="Home">
            TT<span className="text-violet-400">.</span>
          </button>
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link, i) => (
              <li key={link}>
                <button
                  onClick={() => go(link)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active === i ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
          {/* <a href="mailto:tojotom05@gmail.com" className="btn btn-primary hidden !px-5 !py-2 text-sm md:inline-flex">
            Hire me
          </a>
          <button
            className="mr-1 grid h-10 w-10 place-items-center rounded-full text-gray-300 hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <Icon.Close className="h-5 w-5" /> : <Icon.Menu className="h-5 w-5" />}
          </button> */}
        </nav>
        {menuOpen && (
          <div className="glass absolute left-4 right-4 top-[4.6rem] rounded-3xl p-3 md:hidden">
            {NAV_LINKS.map((link, i) => (
              <button
                key={link}
                onClick={() => go(link)}
                className={`block w-full rounded-2xl px-4 py-3 text-left text-base font-medium ${
                  active === i ? "bg-white/10 text-white" : "text-gray-300"
                }`}
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* ================= Hero / About ================= */}
        <section id="about" className="relative min-h-[100dvh] overflow-hidden px-6 pt-24 md:px-10">
          <div className="hero-glow" aria-hidden="true" />

          {/* social rail */}
          <div className="absolute bottom-1/3 left-6 z-20 hidden flex-col items-center gap-5 text-gray-400 md:flex">
            <span className="h-16 w-px bg-gradient-to-b from-transparent to-white/30" />
            <a href="https://github.com/tojotk" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-white">
              <Icon.Github className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/in/tojo-tom-kattakayam/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-white">
              <Icon.Linkedin className="h-5 w-5" />
            </a>
            <a href="mailto:tojotom05@gmail.com" aria-label="Email" className="transition-colors hover:text-white">
              <Icon.Mail className="h-5 w-5" />
            </a>
            <a href="https://wa.me/918921981997" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition-colors hover:text-white">
              <Icon.Message className="h-5 w-5" />
            </a>
          </div>

          <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-6rem)] w-full max-w-7xl items-center gap-4 md:grid-cols-[1fr_minmax(0,28rem)_1fr] md:gap-6">
            {/* left: name */}
            <div className="space-y-5 pt-6 text-center md:pt-0 md:text-left md:pl-10">
              <Reveal>
                <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Available for work
                </span>
              </Reveal>
              <Reveal delay={80}>
                <p className="font-display text-lg font-medium text-gray-300 md:text-xl">Hello! I'm</p>
                <h1 className="font-display mt-1 text-4xl font-bold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-5xl">
                  Tojo Tom
                  <br />
                  <span className="text-gradient">Kattakayam</span>
                </h1>
              </Reveal>
            </div>

            {/* center: figure */}
            <Reveal delay={150} className="order-first self-end md:order-none">
              <Tilt max={4} glare={false} className="mx-auto">
                <div className="hero-figure relative mx-auto">
                  <img
                    src="/photos/tojo-cutout.webp"
                    alt="Tojo Tom Kattakayam"
                    className="mx-auto h-[52dvh] max-h-[44rem] w-auto max-w-full object-contain md:h-[76dvh]"
                    style={{ filter: "drop-shadow(0 0 45px rgba(34,211,238,0.22))" }}
                  />
                </div>
              </Tilt>
            </Reveal>

            {/* right: role */}
            <div className="space-y-6 pb-16 text-center md:pb-0 md:text-left">
              <Reveal delay={200}>
                <p className="font-display text-lg font-medium text-gray-300 md:text-xl">AI + Full-StackAI / Machine Learning Developer</p>
                <p className="font-display mt-1 text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-5xl">
                  <span className="whitespace-nowrap bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">AI / Machine Learning </span>
                  <br />
                  <span className="text-white">Developer</span>
                </p>
              </Reveal>
              <Reveal delay={280}>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-400 md:mx-0 md:text-base">
                  Building practical AI/ML systems and the applications around them — from data and models to grounded AI experiences and usable interfaces.
                </p>
              </Reveal>
              <Reveal delay={340} className="flex flex-wrap justify-center gap-3 md:justify-start">
                <button onClick={() => go("projects")} className="btn btn-primary">
                  View my work <Icon.ArrowDown className="h-4 w-4" />
                </button>
                <button onClick={() => go("contact")} className="btn btn-ghost">
                  Get in touch <Icon.ArrowUpRight className="h-4 w-4" />
                </button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= Tech marquee ================= */}
        <div className="marquee relative border-y border-white/[0.06] bg-black/20 py-5 backdrop-blur-sm" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE].map((t, i) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-mono text-xs text-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet-400 to-cyan-300" />
                {t}
              </span>
            ))}
          </div>
        </div>

      <section id="services" className="relative px-6 py-28 md:px-10">
  <div className="mx-auto max-w-7xl">

    <SectionHeader
      num="01"
      eyebrow="What I build"
      title="AI solutions engineered for real use"
      intro="From machine learning models and generative AI to full-stack applications, I build technology that moves from idea to working product."
    />

    {/* Service Cards */}
    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((service, i) => {
        const S = service.icon;

        return (
          <Reveal key={service.title} delay={i * 80}>
            <Tilt max={6} className="h-full">

              <div className="group glass relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-3xl p-7 md:p-8">

                {/* Ambient Glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20" />

                {/* Service Number */}
                <div className="absolute right-7 top-7 font-mono text-[10px] tracking-[0.25em] text-gray-600">
                  {service.number}
                </div>

                {/* Icon */}
                <div
                  className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/15 text-cyan-300 ring-1 ring-white/10 transition-all duration-500 group-hover:scale-105 group-hover:ring-cyan-300/30"
                  style={{ transform: "translateZ(35px)" }}
                >
                  <S className="h-6 w-6" />
                </div>

                {/* Title */}
                <div className="relative mt-7">
                  <h3 className="font-display text-xl font-bold text-white md:text-2xl">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-violet-300/80">
                    {service.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="relative mt-5 flex-1 text-sm leading-7 text-gray-400">
                  {service.text}
                </p>

                {/* Technology Tags */}
                <div
                  className="relative mt-7 flex flex-wrap gap-2"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-1.5 font-mono text-[10px] text-gray-300 transition-all duration-300 group-hover:border-white/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet-400 to-cyan-300 transition-all duration-500 group-hover:w-full" />

              </div>

            </Tilt>
          </Reveal>
        );
      })}
    </div>

    {/* Workflow */}
    <Reveal delay={120} className="mt-10">
      <div className="glass overflow-hidden rounded-3xl p-6 md:p-8">

        <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/70">
              My workflow
            </p>

            <h3 className="font-display mt-2 text-xl font-bold text-white md:text-2xl">
              From idea to intelligent product
            </h3>
          </div>

          <p className="max-w-md text-sm leading-6 text-gray-500">
            A practical development workflow connecting data, AI models,
            backend systems and user-facing applications.
          </p>

        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">

          {PIPELINE.map((p, i) => {
            const P = p.icon;

            return (
              <div
                key={p.label}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.04]"
              >

                <div className="flex items-start justify-between">

                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/10">
                    <P className="h-5 w-5" />
                  </span>

                  <span className="font-mono text-[10px] text-gray-600">
                    0{i + 1}
                  </span>

                </div>

                <p className="font-display mt-5 font-semibold text-white">
                  {p.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {p.text}
                </p>

                {i < PIPELINE.length - 1 && (
                  <Icon.ArrowUpRight
                    className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 text-gray-700 lg:block"
                  />
                )}

              </div>
            );
          })}

        </div>

      </div>
    </Reveal>

  </div>
</section>

        {/* ================= Skills ================= */}
        <section id="skills" className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
                    num="02"
                    eyebrow="AI • ML • Full-Stack"
                     title="Technical Skills"
                       intro="A practical toolkit spanning machine learning, generative AI, full-stack development, data science and modern application engineering."/>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {SKILLS.map((group, i) => {
                const G = group.icon;
                return (
                  <Reveal key={group.category} delay={i * 70}>
                    <Tilt max={5} className="glass h-full rounded-3xl p-8">
                      <div className="mb-6 flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-violet-200 ring-1 ring-white/10">
                          <G className="h-5 w-5" />
                        </span>
                        <h3 className="font-display text-lg font-semibold text-white">{group.category}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2" style={{ transform: "translateZ(24px)" }}>
                        {group.items.map((skill) => (
                          <span
                            key={skill}
                            className="cursor-default rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-violet-400/50 hover:bg-violet-500/15 hover:text-white"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </Tilt>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

{/* ================= Projects ================= */}
<section id="projects" className="relative px-6 py-28 md:px-10">
  <div className="mx-auto max-w-7xl">

    <SectionHeader
      num="03"
      eyebrow="Projects"
      title="AI projects built with purpose"
      intro="A curated selection of machine learning, computer vision, NLP and full-stack AI projects focused on solving practical problems through intelligent software."
    />

    <div className="mt-14 grid gap-6 lg:grid-cols-12">

      {FEATURED_PROJECTS.map((project, i) => (
        <Reveal
          key={project.title}
          delay={(i % 3) * 80}
          className={
            project.featured
              ? "lg:col-span-7"
              : i === 1
                ? "lg:col-span-5"
                : "lg:col-span-4"
          }
        >
          <Tilt max={6} className="h-full">

            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`project-card glass group relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-3xl p-7 md:p-8 ${
                project.featured ? "project-featured" : ""
              }`}
            >

              {/* Ambient Glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-700 group-hover:bg-cyan-400/20" />

              {/* Project Number */}
              <div className="absolute right-7 top-7 font-mono text-[10px] tracking-[0.25em] text-gray-600">
                {project.number}
              </div>

              {/* Header */}
              <div className="relative">

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet-400 to-cyan-300" />

                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/80">
                    {project.featured
                      ? "Featured project"
                      : "Selected project"}
                  </p>
                </div>

                <h3 className="font-display mt-4 max-w-xl text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-50 md:text-3xl">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-violet-300">
                  {project.subtitle}
                </p>

                {project.category && (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-600">
                    {project.category}
                  </p>
                )}

              </div>

              {/* Project Description */}
              <div className="relative mt-7 flex-1">

                <p className="text-sm leading-7 text-gray-400">
                  {project.text}
                </p>

                {/* Engineering Focus */}
                {project.impact && (
                  <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all duration-300 group-hover:border-cyan-400/10 group-hover:bg-white/[0.04]">

                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/60">
                      Engineering focus
                    </p>

                    <p className="mt-2 text-xs leading-6 text-gray-500">
                      {project.impact}
                    </p>

                  </div>
                )}

              </div>

              {/* Technology Stack */}
              <div className="relative mt-7 flex flex-wrap gap-2">

                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-1.5 font-mono text-[10px] text-gray-300 transition-all duration-300 group-hover:border-cyan-300/15 group-hover:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}

              </div>

              {/* Footer */}
              <div className="relative mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">

                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-600 transition-colors group-hover:text-gray-400">
                  View source
                </span>

                <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-gray-500 transition-all duration-300 group-hover:border-cyan-300/30 group-hover:bg-cyan-300/10 group-hover:text-cyan-300">

                  <Icon.ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

                </span>

              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet-400 via-cyan-300 to-transparent transition-all duration-700 group-hover:w-full" />

            </a>

          </Tilt>
        </Reveal>
      ))}

    </div>

  </div>
</section>


{/* ================= GitHub CTA ================= */}
<section className="relative px-6 pb-28 md:px-10">
  <div className="mx-auto max-w-7xl">

    <Reveal delay={180}>

      <div className="glass relative overflow-hidden rounded-3xl p-7 md:p-9">

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          {/* Content */}
          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/70">
              More on GitHub
            </p>

            <h3 className="font-display mt-2 text-2xl font-bold text-white">
              Explore the rest of my development work
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Browse source code, experiments and projects across AI,
              machine learning, Python and application development.
            </p>

          </div>

          {/* CTA */}
          <a
            href="https://github.com/tojotk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary shrink-0"
          >
            Visit GitHub
            <Icon.ArrowUpRight className="h-4 w-4" />
          </a>

        </div>

      </div>

    </Reveal>

  </div>
</section>
        {/* ================= Experience ================= */}
        <section id="experience" className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              num="04"
              eyebrow="Experience & education"
              title="Building experience with intention"
              intro="A practical foundation in Python development, AI/ML and team leadership."
            />
            <div className="mt-14 grid gap-6 lg:grid-cols-5">
              <div className="space-y-5 lg:col-span-3">
                {EXPERIENCE.map((item, i) => (
                  <Reveal key={item.role} delay={i * 90}>
                    <Tilt max={4} className="glass rounded-3xl p-7 md:p-8">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/80">{item.period}</p>
                          <h3 className="font-display mt-2 text-xl font-bold text-white">{item.role}</h3>
                          <p className="mt-1 text-sm text-violet-300">{item.company}</p>
                        </div>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-cyan-300 ring-1 ring-white/10">
                          <Icon.Briefcase className="h-5 w-5" />
                        </span>
                      </div>
                      <p className="mt-6 text-sm leading-7 text-gray-400">{item.text}</p>
                    </Tilt>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={100} className="lg:col-span-2">
                <Tilt max={4} className="glass h-full rounded-3xl p-7 md:p-8">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/15 text-violet-300 ring-1 ring-white/10">
                      <Icon.Cap className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">Education & Certification</p>
                      <h3 className="font-display text-lg font-bold text-white">Academic foundation</h3>
                    </div>
                  </div>

                  <div className="mt-7 space-y-6">
                    {/* Education */}
                    <div>
                      <p className="font-display font-semibold text-white">Bachelor of Computer Applications (BCA)</p>
                      <p className="mt-1 text-sm text-violet-300">St. Benedict's College · 2023–2026</p>
                      <p className="mt-2 text-sm text-gray-500">CGPA: 7.03 / 10</p>
                    </div>

                    {/* Certification */}
                    <div className="border-t border-white/10 pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/80">Certification</p>
                          <p className="font-display mt-2 font-semibold leading-relaxed text-white">
                            Certified Specialist in Artificial Intelligence & Machine Learning
                          </p>
                          <p className="mt-1 text-sm text-violet-300">ICT Academy of Kerala</p>
                        </div>

                        <span className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20 sm:grid">
                          <Icon.Cap className="h-5 w-5" />
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300">
                          375 Hours
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300">
                          May–September 2026
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300">
                          Issued October 2026
                        </span>
                      </div>

                      <a
                        href="/certificates/ict-academy-certificate.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-400/20 hover:text-white"
                      >
                        View Certificate
                        <Icon.ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </div>
                </Tilt>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= Profile ================= */}
        <section id="profile" className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionHeader num="05" eyebrow="Get to know me" title="Profile" />
            <div className="mt-14 grid gap-6 md:grid-cols-5">
              <Reveal className="md:col-span-3">
                <Tilt max={4} className="glass h-full rounded-3xl p-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-violet-400/60 shadow-lg shadow-violet-900/40">
                      <img src="/photos/IMG_1.jpeg" alt="Tojo Tom Kattakayam" className="h-full w-full object-cover object-[50%_20%]" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white">Tojo Tom Kattakayam</h3>
                      <p className="text-sm text-violet-300">AI / Machine Learning Developer</p>
                    </div>
                  </div>
                  <p className="mt-6 text-sm leading-7 text-gray-400">
                    BCA graduate and certified AI/ML specialist focused on practical machine learning, computer vision, NLP and
                    generative AI applications. I enjoy taking ideas from experimentation to usable software.
                  </p>
                  <dl className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    <Detail icon={<Icon.Pin />} label="Location" value="Kozhikode, Kerala, India" />
                    <Detail icon={<Icon.Mail />} label="Email" value="tojotom05@gmail.com" />
                    <Detail icon={<Icon.Phone />} label="Phone" value="+91 8921981997" />
                    <Detail icon={<Icon.Cap />} label="Education" value="BCA · 2023–2026" />
                    <Detail icon={<Icon.Briefcase />} label="Status" value="Open to AI/ML roles" valueClass="text-emerald-400" />
                    <Detail icon={<Icon.Globe />} label="Languages" value="English, Malayalam" />
                    <Detail icon={<Icon.Target />} label="Interests" value="AI/ML, Full-Stack Development, Music" />
                  </dl>
                </Tilt>
              </Reveal>

              <div className="space-y-4 md:col-span-2">
                <Social
                  delay={0}
                  icon={<Icon.Github />}
                  label="GitHub"
                  handle="github.com/tojotk"
                  description="Code Portfolio"
                  href="https://github.com/tojotk"
                  tint="from-slate-500 to-slate-700"
                />
                <Social
                  delay={80}
                  icon={<Icon.Linkedin />}
                  label="LinkedIn"
                  handle="linkedin.com/in/tojo-tom-kattakayam"
                  description="Professional Network"
                  href="https://www.linkedin.com/in/tojo-tom-kattakayam/"
                  tint="from-sky-500 to-blue-700"
                />
                <Social
                  delay={160}
                  icon={<Icon.Mail />}
                  label="Email"
                  handle="tojotom05@gmail.com"
                  description="Let's talk about your project"
                  href="mailto:tojotom05@gmail.com"
                  tint="from-violet-500 to-indigo-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= Contact ================= */}
        <section id="contact" className="px-6 pb-16 pt-28 md:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <SectionCentered eyebrow="06 · Let's connect" title="Get In Touch" />
              <Reveal delay={100}>
                <p className="mx-auto mt-6 max-w-2xl text-gray-400 md:text-lg">
                  Interested in collaborating on an AI/ML project or building a Python / Django web application? Feel free to reach
                  out through any of the options below.
                </p>
              </Reveal>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <ContactCard
                delay={0}
                href="mailto:tojotom05@gmail.com"
                icon={<Icon.Mail />}
                title="Email"
                text="tojotom05@gmail.com"
                cta="Send Email"
                tint="from-violet-500 to-indigo-600"
              />
              <ContactCard
                delay={90}
                href="https://wa.me/918921981997"
                external
                icon={<Icon.Message />}
                title="WhatsApp"
                text="Chat with me instantly"
                cta="Message"
                tint="from-emerald-500 to-green-600"
              />
              <ContactCard
                delay={180}
                href="https://www.linkedin.com/in/tojo-tom-kattakayam/"
                external
                icon={<Icon.Linkedin />}
                title="LinkedIn"
                text="Tojo Tom Kattakayam"
                cta="Connect"
                tint="from-sky-500 to-blue-700"
              />
            </div>

            <footer className="mt-24 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-sm text-gray-500 sm:flex-row">
              <p>© {new Date().getFullYear()} Tojo Tom Kattakayam</p>
              <p>AI &amp; ML · Full-Stack Python · Kozhikode, India</p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------------- small pieces ---------------- */

function SectionCentered({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-display mt-3 text-4xl font-bold tracking-tight text-white md:text-6xl">{title}</h2>
      <div className="mx-auto mt-5 h-[3px] w-14 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
    </Reveal>
  );
}

function Detail({ icon, label, value, valueClass = "text-white" }: { icon: ReactNode; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-violet-300 ring-1 ring-white/10 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</dt>
        <dd className={`break-words text-sm font-medium ${valueClass}`}>{value}</dd>
      </div>
    </div>
  );
}

function Social({
  icon,
  label,
  handle,
  description,
  href,
  tint,
  delay,
}: {
  icon: ReactNode;
  label: string;
  handle: string;
  description: string;
  href: string;
  tint: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <Tilt max={5}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="glass group flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-white/25"
        >
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${tint} text-white shadow-lg [&>svg]:h-5 [&>svg]:w-5`}>
            {icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-white">{label}</span>
            <span className="block truncate text-xs text-gray-400">{handle}</span>
            <span className="mt-0.5 block text-[11px] text-gray-500">{description}</span>
          </span>
          <Icon.ArrowUpRight className="h-5 w-5 shrink-0 text-gray-500 transition-colors group-hover:text-violet-300" />
        </a>
      </Tilt>
    </Reveal>
  );
}

function ContactCard({
  href,
  external,
  icon,
  title,
  text,
  cta,
  tint,
  delay,
}: {
  href: string;
  external?: boolean;
  icon: ReactNode;
  title: string;
  text: string;
  cta: string;
  tint: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <Tilt max={9} className="h-full">
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="glass group flex h-full flex-col items-center rounded-3xl p-8 text-center transition-colors hover:border-white/25"
        >
          <span
            className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${tint} text-white shadow-xl [&>svg]:h-7 [&>svg]:w-7`}
            style={{ transform: "translateZ(40px)" }}
          >
            {icon}
          </span>
          <h3 className="font-display mt-6 text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 break-all text-sm text-gray-400">{text}</p>
          <span className="btn btn-ghost mt-7 !py-2.5 text-sm group-hover:border-white/35 group-hover:bg-white/10">
            {cta} <Icon.ArrowUpRight className="h-4 w-4" />
          </span>
        </a>
      </Tilt>
    </Reveal>
  );
}
