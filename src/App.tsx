import { useEffect, useState, type ReactNode } from "react";
import Scene from "./components/Scene";
import { Icon, Reveal, SectionHeader, Tilt } from "./components/ui";

const NAV_LINKS = ["About", "Profile", "Skills", "Projects", "Contact"] as const;

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
    category: "Photography",
    icon: Icon.Camera,
    items: ["Concert Photography", "Event Photography", "Portrait Photography", "Adobe Lightroom", "Adobe Photoshop", "Visual Storytelling"],
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
          className={`glass flex w-full max-w-3xl items-center justify-between rounded-full py-2 pl-5 pr-2 transition-all duration-300 ${
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
        <section id="about" className="relative flex min-h-[100dvh] items-center px-6 pb-16 pt-28 md:px-10">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 md:grid-cols-2">
            <div className="space-y-7">
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
                <p className="eyebrow">Hello, I'm</p>
                <h1 className="font-display mt-3 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
                  <span className="text-gradient">Tojo Tom</span>
                  <br />
                  <span className="text-white">Kattakayam</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="font-display text-xl font-medium text-gray-200 md:text-2xl">
                  AI &amp; ML Developer <span className="mx-2 text-violet-400">/</span> Photographer
                </p>
              </Reveal>
              <Reveal delay={240}>
                <p className="max-w-lg text-base leading-relaxed text-gray-400 md:text-lg">
                  AI &amp; Machine Learning Developer passionate about building intelligent systems, developing predictive models, and
                  solving complex real-world problems through data and innovation. Also a creative photographer who loves capturing
                  moments that tell stories.
                </p>
              </Reveal>
              <Reveal delay={320} className="flex flex-wrap gap-4 pt-2">
                <button onClick={() => go("projects")} className="btn btn-primary">
                  View my work <Icon.ArrowDown className="h-4 w-4" />
                </button>
                <button onClick={() => go("contact")} className="btn btn-ghost">
                  Get in touch <Icon.ArrowUpRight className="h-4 w-4" />
                </button>
              </Reveal>
            </div>

            {/* 3D portrait */}
            <Reveal delay={200} className="flex justify-center md:justify-end">
              <Tilt max={10} className="relative">
                <div className="relative h-[22rem] w-[17rem] sm:h-[26rem] sm:w-[20rem] md:h-[30rem] md:w-[23rem]">
                  <div className="portrait-ring" />
                  <div className="absolute inset-0 overflow-hidden rounded-[1.65rem] bg-ink shadow-2xl shadow-violet-900/50">
                    <img src="/photos/IMG_1.jpeg" alt="Tojo Tom Kattakayam" className="h-full w-full object-cover object-[50%_25%]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  </div>

                  {/* floating depth chips */}
                  <div className="absolute -left-6 top-12 hidden sm:block" style={{ transform: "translateZ(70px)" }}>
                    <div className="glass float flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-white shadow-xl">
                      <Icon.Cpu className="h-4 w-4 text-cyan-300" /> Machine Learning
                    </div>
                  </div>
                  <div className="absolute -right-5 bottom-28 hidden sm:block" style={{ transform: "translateZ(90px)" }}>
                    <div className="glass float flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-white [animation-delay:-2s]">
                      <Icon.Camera className="h-4 w-4 text-violet-300" /> Photography
                    </div>
                  </div>
                  <div className="absolute -bottom-5 left-8 hidden sm:block" style={{ transform: "translateZ(50px)" }}>
                    <div className="glass float flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-white [animation-delay:-3.5s]">
                      <Icon.Code className="h-4 w-4 text-emerald-300" /> Python
                    </div>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          </div>

          <button
            onClick={() => go("profile")}
            aria-label="Scroll to profile"
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-500 hover:text-gray-300 md:flex"
          >
            Scroll
            <span className="relative block h-9 w-[22px] rounded-full border border-white/25">
              <span className="scroll-cue absolute left-1/2 top-2 h-1.5 w-1 -translate-x-1/2 rounded-full bg-white/70" />
            </span>
          </button>
        </section>

        {/* ================= Profile ================= */}
        <section id="profile" className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow="Get to know me" title="Profile" />
            <div className="mt-14 grid gap-6 md:grid-cols-5">
              <Reveal className="md:col-span-3">
                <Tilt max={4} className="glass h-full rounded-3xl p-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-violet-400/60 shadow-lg shadow-violet-900/40">
                      <img src="/photos/IMG_1.jpeg" alt="Tojo Tom Kattakayam" className="h-full w-full object-cover object-[50%_20%]" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-white">Tojo Tom Kattakayam</h3>
                      <p className="text-sm text-violet-300">AI / ML Developer · Photographer</p>
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
                    <Detail icon={<Icon.Target />} label="Interests" value="AI/ML, Music, Photography" />
                  </dl>
                </Tilt>
              </Reveal>

              <div className="space-y-4 md:col-span-2">
                <Social
                  delay={0}
                  icon={<Icon.Instagram />}
                  label="Instagram"
                  handle="@storiesoftt.k"
                  description="Concerts | Artists | Backstage"
                  href="https://www.instagram.com/storiesoftt.k?igsh=OXFmcDhkeW5wa3Vk&utm_source=qr/"
                  tint="from-pink-500 to-orange-400"
                />
                <Social
                  delay={80}
                  icon={<Icon.Instagram />}
                  label="Instagram"
                  handle="@framesoftt.k"
                  description="Faces | Love | Moments"
                  href="https://www.instagram.com/framesoftt.k?igsh=MXIzc2pwZG16aHJnNw%3D%3D&utm_source=qr"
                  tint="from-fuchsia-500 to-rose-400"
                />
                <Social
                  delay={160}
                  icon={<Icon.Github />}
                  label="GitHub"
                  handle="github.com/tojotk"
                  description="Code Portfolio"
                  href="https://github.com/tojotk"
                  tint="from-slate-500 to-slate-700"
                />
                <Social
                  delay={240}
                  icon={<Icon.Linkedin />}
                  label="LinkedIn"
                  handle="linkedin.com/in/tojo-tom-kattakayam"
                  description="Professional Network"
                  href="https://www.linkedin.com/in/tojo-tom-kattakayam/"
                  tint="from-sky-500 to-blue-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= Skills ================= */}
        <section id="skills" className="px-6 py-28 md:px-10">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow="Technologies I work with" title="Skills" intro="From data pipelines and models to the lens — the tools I reach for every day." />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SKILLS.map((group, i) => {
                const G = group.icon;
                return (
                  <Reveal key={group.category} delay={i * 70}>
                    <Tilt max={6} className="glass h-full rounded-3xl p-7">
                      <div className="mb-5 flex items-center gap-3">
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
            <SectionHeader eyebrow="Open-source projects from my GitHub" title="GitHub Projects" />
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

        {/* ================= Contact ================= */}
        <section id="contact" className="px-6 pb-16 pt-28 md:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <SectionCentered eyebrow="Let's connect" title="Get In Touch" />
              <Reveal delay={100}>
                <p className="mx-auto mt-6 max-w-2xl text-gray-400 md:text-lg">
                  Interested in collaborating on an AI/ML project, software development, or professional photography? Feel free to
                  reach out through any of the options below.
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
                href="https://www.instagram.com/storiesoftt.k"
                external
                icon={<Icon.Instagram />}
                title="Instagram"
                text="@storiesoftt.k"
                cta="Follow / Message"
                tint="from-pink-500 to-orange-400"
              />
            </div>

            <footer className="mt-24 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-sm text-gray-500 sm:flex-row">
              <p>© {new Date().getFullYear()} Tojo Tom Kattakayam</p>
              <p>Kozhikode, Kerala · India</p>
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
