import { useEffect, useState } from "react";
import { SplitText } from "./ui";

type Step =
  | { kind: "cmd"; text: string }
  | { kind: "name" }
  | { kind: "out"; text: string }
  | { kind: "ok"; text: string };

const STEPS: Step[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "name" },
  { kind: "cmd", text: "cat role.txt" },
  { kind: "out", text: "Full-Stack & AI / ML Developer" },
  { kind: "cmd", text: "ls stack/" },
  { kind: "out", text: "python  django  react  rag  cv  nlp" },
  { kind: "cmd", text: "./status.sh" },
  { kind: "ok", text: "Open to AI/ML roles" },
];

const PROMPT = (
  <span className="select-none">
    <span className="text-frost-400">tojo</span>
    <span className="text-gray-500">@</span>
    <span className="text-azure-300">portfolio</span>
    <span className="text-gray-500"> ~ </span>
    <span className="text-azure-400">❯</span>{" "}
  </span>
);

/** A terminal window that types out the hero introduction. */
export default function HeroTerminal({ start }: { start: boolean }) {
  const [lines, setLines] = useState<Step[]>([]);
  const [typing, setTyping] = useState<string | null>(null);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLines(STEPS);
      return;
    }
    let dead = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    setLines([]);
    (async () => {
      for (const s of STEPS) {
        if (dead) return;
        if (s.kind === "cmd") {
          for (let i = 1; i <= s.text.length; i++) {
            if (dead) return;
            setTyping(s.text.slice(0, i));
            await sleep(40 + Math.random() * 55);
          }
          await sleep(260);
          if (dead) return;
          setTyping(null);
          setLines((l) => [...l, s]);
        } else {
          await sleep(140);
          if (dead) return;
          setLines((l) => [...l, s]);
          await sleep(s.kind === "name" ? 1100 : 380);
        }
      }
    })();
    return () => {
      dead = true;
    };
  }, [start]);

  const finished = lines.length === STEPS.length;
  const showPrompt = typing !== null || lines.length === 0 || finished;

  return (
    <div className="term" role="img" aria-label="Terminal: Hello, I'm Tojo Tom Kattakayam — Full-Stack and AI / ML Developer">
      <div className="term-bar">
        <i className="bg-[#ff5f57]" />
        <i className="bg-[#febc2e]" />
        <i className="bg-[#28c840]" />
        <span className="ml-3 font-mono text-[10px] tracking-wider text-gray-500">tojo@portfolio — zsh</span>
      </div>
      <div className="term-body" aria-hidden="true">
        <div className="term-scan" />
        {lines.map((s, i) => {
          if (s.kind === "cmd")
            return (
              <div key={i} className="term-line">
                {PROMPT}
                <span className="text-gray-100">{s.text}</span>
              </div>
            );
          if (s.kind === "name")
            return (
              <div key={i} className="term-out">
                <p className="font-mono text-[12px] text-gray-400">Hello, I&apos;m</p>
                <h1 className="font-display mt-1 text-[2.1rem] font-bold uppercase leading-[1.04] tracking-tight text-white">
                  <SplitText text="Tojo Tom" />
                  <br />
                  <SplitText text="Kattakayam" base={300} gradient />
                </h1>
              </div>
            );
          if (s.kind === "ok")
            return (
              <div key={i} className="term-out text-emerald-400">
                <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {s.text}
              </div>
            );
          return (
            <div key={i} className="term-out text-azure-200">
              {s.text}
            </div>
          );
        })}
        {showPrompt && (
          <div className="term-line">
            {PROMPT}
            <span className="text-gray-100">{typing ?? ""}</span>
            <span className="term-caret" />
          </div>
        )}
      </div>
    </div>
  );
}
