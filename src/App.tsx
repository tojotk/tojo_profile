import { useEffect, useState, type ReactNode } from "react";
import Scene from "./components/Scene";
import { Icon, Reveal, SectionHeader, Tilt } from "./components/ui";

const NAV_LINKS = ["About", "Services", "Skills", "Projects", "Profile", "Contact"] as const;

const MARQUEE = [
  "Python",
  "Django",
  "Machine Learning",
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
    title: "Machine Learning & Data",
    text: "Predictive models and data analysis, from cleaning and preprocessing to training and evaluation.",
    tags: ["Scikit-learn", "Pandas", "NumPy", "Matplotlib"],
  },
  {
    icon: Icon.Code,
    title: "Full-Stack Python Development",
    text: "Web applications with a Django backend, MySQL data layer and a responsive HTML, CSS and JavaScript frontend.",
    tags: ["Python", "Django", "MySQL", "JavaScript"],
  },
  {
    icon: Icon.Layers,
    title: "Intelligent Applications",
    text: "Taking models out of the notebook and into real products that people can use.",
    tags: ["Jupyter", "Git", "GitHub", "Figma"],
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
    items: ["Machine Learning", "Data Analysis", "Data Preprocessing", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Jupyter Notebook"],
  },
  {
    category: "Programming",
    icon: Icon.Code,
    items: ["Python", "Java", "JavaScript", "PHP", "HTML5", "CSS3", "MySQL"],
  },
  {
    category: "Frameworks & Tools",
    icon: Icon.Tool,
    items: ["Django", "Git", "GitHub", "VS Code", "PyCharm", "Google Colab", "Figma"],
  },
  {
    category: "Professional Skills",
    icon: Icon.Users,
    items: ["Problem Solving", "Leadership", "Teamwork", "Communication", "Critical Thinking", "Time Management"],
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
          <a href="mailto:tojotom05@gmail.com" className="btn btn-primary hidden !px-5 !py-2 text-sm md:inline-flex">
            Hire me
          </a>
          <button
            className="mr-1 grid h-10 w-10 place-items-center rounded-full text-gray-300 hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <Icon.Close className="h-5 w-5" /> : <Icon.Menu className="h-5 w-5" />}
          </button>
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
                <p className="font-display text-lg font-medium text-gray-300 md:text-xl">AI &amp; ML Developer</p>
                <p className="font-display mt-1 text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-5xl">
                  <span className="whitespace-nowrap bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">Full-Stack</span>
                  <br />
                  <span className="text-white">Python</span>
                </p>
              </Reveal>
              <Reveal delay={280}>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-400 md:mx-0 md:text-base">
                  Building intelligent systems and the Django web applications around them — from raw data to a working interface.
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

        {/* ================= Services ================= */}
        <section id="services" className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              num="01"
              eyebrow="What I do"
              title="From data to deployed product"
              intro="Machine learning and full-stack Python development, end to end."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {SERVICES.map((s, i) => {
                const S = s.icon;
                return (
                  <Reveal key={s.title} delay={i * 90}>
                    <Tilt max={7} className="glass h-full rounded-3xl p-8">
                      <span
                        className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-900/40"
                        style={{ transform: "translateZ(40px)" }}
                      >
                        <S className="h-6 w-6" />
                      </span>
                      <h3 className="font-display mt-6 text-xl font-semibold text-white">{s.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-400">{s.text}</p>
                      <div className="mt-6 flex flex-wrap gap-2" style={{ transform: "translateZ(20px)" }}>
                        {s.tags.map((t) => (
                          <span key={t} className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-gray-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </Tilt>
                  </Reveal>
                );
              })}
            </div>

            {/* pipeline */}
            <Reveal delay={100} className="mt-10">
              <div className="glass grid gap-2 rounded-3xl p-3 sm:grid-cols-2 lg:grid-cols-4">
                {PIPELINE.map((p, i) => {
                  const P = p.icon;
                  return (
                    <div key={p.label} className="relative flex items-center gap-4 rounded-2xl px-5 py-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-cyan-300 ring-1 ring-white/10">
                        <P className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Step 0{i + 1}</p>
                        <p className="font-display font-semibold text-white">{p.label}</p>
                        <p className="text-xs text-gray-400">{p.text}</p>
                      </div>
                      {i < PIPELINE.length - 1 && <Icon.ArrowUpRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 text-gray-600 lg:block" />}
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= Skills ================= */}
        <section id="skills" className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionHeader num="02" eyebrow="Technologies I work with" title="Skills" intro="The languages, libraries and tools I reach for every day." />
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
        <section id="projects" className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-7xl">
            <SectionHeader num="03" eyebrow="Open-source projects from my GitHub" title="GitHub Projects" />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {repoState === "loading" &&
                Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-52 rounded-3xl border border-white/5" />)}

              {repoState === "error" && (
                <div className="glass col-span-full rounded-3xl p-10 text-center">
                  <p className="text-gray-300">Couldn't load projects right now.</p>
                  <a href="https://github.com/tojotk" target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-5">
                    Browse them on GitHub <Icon.ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              )}

              {repoState === "ready" && repos.length === 0 && (
                <div className="glass col-span-full rounded-3xl p-10 text-center text-gray-400">No public repositories yet.</div>
              )}

              {repos.map((repo, i) => (
                <Reveal key={repo.id} delay={(i % 3) * 80}>
                  <Tilt max={7} className="h-full">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass group flex h-full min-h-52 flex-col rounded-3xl p-7 transition-colors hover:border-violet-400/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display break-words text-xl font-semibold text-white">{repo.name}</h3>
                        <Icon.ArrowUpRight className="h-5 w-5 shrink-0 text-gray-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300" />
                      </div>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">{repo.description || "No description available."}</p>
                      <div className="mt-6 flex items-center gap-4 text-xs text-gray-400">
                        {repo.language && (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[repo.language] ?? "#8b5cf6" }} />
                            {repo.language}
                          </span>
                        )}
                        {!!repo.stargazers_count && (
                          <span className="inline-flex items-center gap-1">
                            <Icon.Star className="h-3.5 w-3.5" />
                            {repo.stargazers_count}
                          </span>
                        )}
                        <span className="ml-auto font-medium text-violet-300 opacity-0 transition-opacity group-hover:opacity-100">View →</span>
                      </div>
                    </a>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= Profile ================= */}
        <section id="profile" className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionHeader num="04" eyebrow="Get to know me" title="Profile" />
            <div className="mt-14 grid gap-6 md:grid-cols-5">
              <Reveal className="md:col-span-3">
                <Tilt max={4} className="glass h-full rounded-3xl p-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-violet-400/60 shadow-lg shadow-violet-900/40">
                      <img src="/photos/IMG_1.jpeg" alt="Tojo Tom Kattakayam" className="h-full w-full object-cover object-[50%_20%]" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white">Tojo Tom Kattakayam</h3>
                      <p className="text-sm text-violet-300">AI / ML Developer · Full-Stack Python Developer</p>
                    </div>
                  </div>
                  <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    <Detail icon={<Icon.Pin />} label="Location" value="Kozhikode, Kerala, India" />
                    <Detail icon={<Icon.User />} label="Age" value="21" />
                    <Detail icon={<Icon.Mail />} label="Email" value="tojotom05@gmail.com" />
                    <Detail icon={<Icon.Phone />} label="Phone" value="+91 8921981997" />
                    <Detail icon={<Icon.Cap />} label="Education" value="BCA — AI/ML" />
                    <Detail icon={<Icon.Briefcase />} label="Status" value="Available for work" valueClass="text-emerald-400" />
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
              <SectionCentered eyebrow="Let's connect" title="Get In Touch" />
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
