import { lazy, Suspense, useEffect, useState } from "react";
import snapshot from "./data/github.json";
import { profile } from "./data/profile.js";
import { buildProjects } from "./data/projects.js";
import Desktop from "./components/Desktop.jsx";

const Macbook = lazy(() => import("./components/Macbook.jsx"));
const projects = buildProjects(snapshot.repos);
const mobileQuery =
  "(max-width: 680px), (pointer: coarse) and (max-width: 1024px)";

export default function App() {
  const [focused, setFocused] = useState(false);
  const [mobile, setMobile] = useState(
    () => window.matchMedia(mobileQuery).matches,
  );

  function exitScreen() {
    setFocused(false);
    requestAnimationFrame(() =>
      document
        .querySelector(
          ".mobile-screen-host:not([hidden]) .os-menu-home, .world-stage:not([hidden])",
        )
        ?.focus({ preventScroll: true }),
    );
  }
  useEffect(() => {
    const media = window.matchMedia(mobileQuery);
    const resize = () => setMobile(media.matches);
    const key = (event) => {
      if (event.key === "Escape") exitScreen();
    };
    window.addEventListener("keydown", key);
    media.addEventListener("change", resize);
    return () => {
      window.removeEventListener("keydown", key);
      media.removeEventListener("change", resize);
    };
  }, []);

  return (
    <main className="portfolio-world" id="home">
      <h1 className="sr-only">{profile.name}'s interactive portfolio</h1>
      <Suspense fallback={null}>
        <Macbook
          focused={focused}
          mobile={mobile}
          onEnter={() => setFocused(true)}
        >
          <Desktop projects={projects} onExit={exitScreen} />
        </Macbook>
      </Suspense>
    </main>
  );
}
