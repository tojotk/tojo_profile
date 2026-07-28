import { useState, useEffect } from "react";

const NAV_LINKS = ["About", "Profile", "Skills", "Projects", "Photography", "Contact"];

const SKILLS = [
  {
    category: "🤖 AI & Machine Learning",
    items: [
      "Machine Learning",
      "Data Analysis",
      "Data Preprocessing",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Jupyter Notebook",
    ],
  },
  {
    category: "💻 Programming",
    items: [
      "Python",
      "Java",
      "JavaScript",
      "PHP",
      "HTML5",
      "CSS3",
      "MySQL",
    ],
  },
  {
    category: "⚡ Frameworks & Tools",
    items: [
      "Django",
      "Git",
      "GitHub",
      "VS Code",
      "PyCharm",
      "Google Colab",
      "Figma",
    ],
  },
  {
    category: "📸 Photography",
    items: [
      "Concert Photography",
      "Event Photography",
      "Portrait Photography",
      "Adobe Lightroom",
      "Adobe Photoshop",
      "Visual Storytelling",
    ],
  },
  {
    category: "🤝 Professional Skills",
    items: [
      "Problem Solving",
      "Leadership",
      "Teamwork",
      "Communication",
      "Critical Thinking",
      "Time Management",
    ],
  },

];

const GALLERY = [
  {
    src: "public/IMG_9348.JPG.jpeg",
    caption: "Backstage with VEDAN",
    size: "md:col-span-2 md:row-span-2",
  },
  { src: "public/IMG_9349.JPG.jpeg", caption: "GABRI Live at Trivandrum", size: "" },
  { src: "public/photos/IMG_4249.jpg", caption: "YOGI SEKHAR Live at NIT Calicut", size: "" },
  { src: "public/photos/IMG_4537.jpg", caption: "VINEETH SREENIVASAN Live at NIT Calicut", size: "" },
  { src: "public/photos/Sdee.jpg", caption: "SDEE Live at Trivandrum", size: "" },
  { src: "public/IMG_9484.JPG.jpeg", caption: "VEDAN at Calicut", size: "" },
  { src: "public/IMG_4406.PNG", caption: "STIC & MC COUPER Live at Kannur", size: "" },
  { src: "public/IMG_4405.PNG", caption: "SALIM MERCHANT Live at NIT Calicut", size: "" },
];

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
};

export default function App() {
  const [activeSection, setActiveSection] = useState("About");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    fetch("https://api.github.com/users/tojotk/repos?per_page=20&sort=updated")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setRepos(data))
      .catch((err) => console.error("Failed to fetch GitHub repos:", err));
  }, []);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 relative flex items-center h-16">
          {/* <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
            📸 💻
          </span> */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 md:flex gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <button
                  onClick={() => scrollToSection(link)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === link
                      ? "text-violet-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
          <ul className="absolute left-1/2 flex -translate-x-1/2 gap-4 md:hidden">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <button
                  onClick={() => scrollToSection(link)}
                  className="text-[10px] text-gray-400 hover:text-white transition-colors"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero / About */}
      <section
        id="about"
        className={`${activeSection === "About" ? "flex" : "hidden"} min-h-[100dvh] items-center px-8 pt-16`}
      >
        <div className="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center py-12">
          <div className="space-y-6">
            <p className="text-violet-400 font-semibold tracking-widest uppercase text-xs">
              HELLO, I'M
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              <span className="text-white">TOJO TOM KATTAKAYAM</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              AI &amp; ML Developer <span className="text-violet-400">|</span> Photographer
            </p>
            <p className="text-gray-400 leading-relaxed text-base max-w-lg">
              AI &amp; Machine Learning Developer passionate about building
              intelligent systems, developing predictive models, and solving
              complex real-world problems through data and innovation. Also a
              creative photographer who loves capturing moments that tell stories.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/40">
                <img
                  src="/photos/IMG_1.jpeg"
                  alt="Tojo Tom"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile */}
      <section
        id="profile"
        className={`${activeSection === "Profile" ? "block" : "hidden"} min-h-screen py-24 px-8 bg-gray-900/40`}
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeader title="Profile" subtitle="Get to know me" />
          <div className="mt-12 grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 bg-gray-900 border border-white/10 rounded-2xl p-8 space-y-5">
              <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                {/* <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-sky-600 flex items-center justify-center text-3xl">
                  👤
                </div> */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-violet-500 shadow-lg">
  <img
    src="public\photos\IMG_1.jpeg"
    alt="Tojo Kattakayam"
    className="w-full h-full object-cover"
  />
</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Tojo Tom Kattakayam</h3>
                  <p className="text-violet-400 text-sm">AI / ML Developer · Photographer</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                <ProfileDetail icon="📍" label="Location" value="Kozhikode, Kerala, India" />
                <ProfileDetail icon="🎂" label="Age" value="21" />
                <ProfileDetail icon="✉️" label="Email" value="tojotom05@gmail.com" />
                <ProfileDetail icon="📱" label="Phone" value="+91 8921981997" />
                <ProfileDetail icon="🎓" label="Education" value="BCA — AI/ML" />
                <ProfileDetail icon="💼" label="Status" value="Available for work" valueClass="text-emerald-400" />
                <ProfileDetail icon="🗣️" label="Languages" value="English, Malayalam" />
                <ProfileDetail icon="🎯" label="Interests" value="AI/ML, Music, Photography" />
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <SocialButton
                label="Instagram"
                handle="@storiesoftt.k"
                icon="📸"
                href="https://www.instagram.com/storiesoftt.k?igsh=OXFmcDhkeW5wa3Vk&utm_source=qr/"
                gradient="from-pink-500 via-red-500 to-yellow-500"
                description="Concerts | Artists | Backstage"
              />
              <SocialButton
                label="Instagram"
                handle="@framesoftt.k"
                icon="📸"
                href="https://www.instagram.com/framesoftt.k?igsh=MXIzc2pwZG16aHJnNw%3D%3D&utm_source=qr"
                gradient="from-pink-500 via-red-500 to-yellow-500"
                description="Faces | Love | Moments"
              />
              <SocialButton
                label="GitHub"
                handle="github.com/tojotk"
                icon="💻"
                href="https://github.com/tojotk"
                gradient="from-gray-700 to-gray-900"
                description="Code Portfolio"
              />
              <SocialButton
                label="LinkedIn"
                handle="linkedin.com/in/tojo-tom-kattakayam"
                icon="💼"
                href="https://www.linkedin.com/in/tojo-tom-kattakayam/"
                gradient="from-sky-600 to-blue-800"
                description="Professional Network"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section
        id="skills"
        className={`${activeSection === "Skills" ? "block" : "hidden"} min-h-screen py-24 px-8`}
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Skills" subtitle="Technologies I work with" />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {SKILLS.map((group) => (
              <div
                key={group.category}
                className="bg-gray-900 border border-white/10 rounded-2xl p-6 hover:border-violet-500/40 transition-colors"
              >
                <h3 className="text-lg font-bold text-violet-400 mb-4">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-violet-900/40 hover:text-violet-300 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className={`${activeSection === "Projects" ? "block" : "hidden"} min-h-screen py-24 px-8 bg-gray-900/50`}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="GitHub Projects" subtitle="Open-source projects from my GitHub" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-gray-900 border border-white/10 rounded-3xl p-6 hover:border-violet-500 hover:-translate-y-2 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white">{repo.name}</h3>
                <p className="text-gray-400 mt-3 min-h-[70px]">
                  {repo.description || "No description available."}
                </p>
                <div className="flex items-center justify-end mt-6">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 transition"
                  >
                    View →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photography */}
      <section
        id="photography"
        className={`${activeSection === "Photography" ? "block" : "hidden"} min-h-screen py-24 px-8`}
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Photography" subtitle="Concerts · Portraits · Backstage" />
          <p className="text-center text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Specializing in concert, live event, and artist photography, transforming
            unforgettable moments into timeless visuals with creativity and precision.
          </p>
          <div className="mt-14">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-2xl">📷</span> Photos with Artists
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
              {GALLERY.map((photo) => (
                <button
                  key={photo.src}
                  onClick={() => setLightbox(photo.src)}
                  className={`relative overflow-hidden rounded-2xl group cursor-pointer ${photo.size}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-sm font-medium text-left">{photo.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10 bg-gradient-to-r from-violet-950/40 to-sky-950/40 border border-violet-500/20 rounded-2xl p-6 text-center">
            <p className="text-gray-300 text-sm">
              🎹 <span className="font-semibold text-violet-300">Available</span>{" "}
              for concert photography, artist promo shoots &amp; backstage documentation across India.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
        >
          <img src={lightbox} alt="preview" className="max-h-full max-w-full rounded-2xl shadow-2xl" />
          <button
            className="absolute top-6 right-6 text-white text-3xl w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Contact */}
      <section
        id="contact"
        className={`${activeSection === "Contact" ? "block" : "hidden"} min-h-screen py-24 px-8 bg-gray-900/50`}
      >
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="Get In Touch" subtitle="Let's connect" />
          <p className="text-center text-gray-400 mt-6 max-w-2xl mx-auto">
            Interested in collaborating on an AI/ML project, software development,
            or professional photography? Feel free to reach out through any of the options below.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            <a
              href="mailto:tojotom05@gmail.com"
              className="group bg-gray-900 border border-white/10 rounded-3xl p-8 hover:border-violet-500 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-3xl mx-auto">
                📧
              </div>
              <h3 className="text-xl font-bold text-white text-center mt-6">Email</h3>
              <p className="text-gray-400 text-center mt-2 break-all">tojotom05@gmail.com</p>
              <div className="mt-6 text-center">
                <span className="inline-block px-5 py-2 rounded-xl bg-violet-600 group-hover:bg-violet-500 transition">
                  Send Email
                </span>
              </div>
            </a>
            <a
              href="https://wa.me/918921981997"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-900 border border-white/10 rounded-3xl p-8 hover:border-green-500 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl mx-auto">
                💬
              </div>
              <h3 className="text-xl font-bold text-white text-center mt-6">WhatsApp</h3>
              <p className="text-gray-400 text-center mt-2">Chat with me instantly</p>
              <div className="mt-6 text-center">
                <span className="inline-block px-5 py-2 rounded-xl bg-green-600 group-hover:bg-green-500 transition">
                  Message
                </span>
              </div>
            </a>
            <a
              href="https://www.instagram.com/storiesoftt.k"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-900 border border-white/10 rounded-3xl p-8 hover:border-pink-500 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-3xl mx-auto">
                📸
              </div>
              <h3 className="text-xl font-bold text-white text-center mt-6">Instagram</h3>
              <p className="text-gray-400 text-center mt-2">@storiesoftt.k</p>
              <div className="mt-6 text-center">
                <span className="inline-block px-5 py-2 rounded-xl bg-pink-600 group-hover:bg-pink-500 transition">
                  Follow / Message
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {activeSection !== "About" && (
        <footer className="border-t border-white/10 py-6 text-center text-gray-500 text-sm">
          <p>© Tojo Tom Kattakayam</p>
        </footer>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center space-y-2">
      <p className="text-violet-400 uppercase tracking-widest text-xs font-semibold">{subtitle}</p>
      <h2 className="text-4xl font-extrabold text-white">{title}</h2>
      <div className="mx-auto w-12 h-1 bg-gradient-to-r from-violet-500 to-sky-500 rounded-full mt-3" />
    </div>
  );
}

function ProfileDetail({
  icon,
  label,
  value,
  valueClass = "text-white",
}: {
  icon: string;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-lg mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className={`text-sm font-medium break-words ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

function SocialButton({
  label,
  handle,
  icon,
  href,
  gradient,
  description,
}: {
  label: string;
  handle: string;
  icon: string;
  href: string;
  gradient: string;
  description: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-900 border border-white/10 hover:border-white/30 rounded-2xl p-4 transition-all hover:-translate-y-0.5 group"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-lg flex-shrink-0`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-sm">{label}</p>
          <p className="text-gray-400 text-xs truncate">{handle}</p>
          <p className="text-gray-500 text-[10px] mt-0.5">{description}</p>
        </div>
        <span className="text-gray-500 group-hover:text-violet-400 transition-colors text-lg flex-shrink-0">
          ↗
        </span>
      </div>
    </a>
  );
}
