import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile.js";
import ProjectExplorer from "./ProjectExplorer.jsx";
import { AboutContent, Honors, ContactLinks } from "./Personal.jsx";
import Icon from "./Icon.jsx";

const apps = [
  { id: "home", title: "Home", english: "HOME", icon: "monitor" },
  { id: "about", title: "About", english: "ABOUT", icon: "user" },
  { id: "projects", title: "Projects", english: "PROJECTS", icon: "folder" },
  { id: "honors", title: "Honors", english: "HONORS", icon: "award" },
  { id: "contact", title: "Contact", english: "CONTACT", icon: "mail" },
];

function HappyMac() {
  return (
    <svg
      className="happy-mac"
      viewBox="0 0 80 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M12 5h51l5 5v64H7V10zM15 13h45v43H15zM20 20v9m31-9v9M37 21v14h-7m-9 6 7 5h15l9-7M17 65h12m23 0h7M7 75h61v8H7zM14 84h48" />
    </svg>
  );
}

export default function Desktop({ projects, onExit }) {
  const [active, setActive] = useState("home");
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [now, setNow] = useState(new Date());
  const screenRef = useRef(null);
  const dragRef = useRef(null);
  const selected = apps.find((app) => app.id === active);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  function openApp(id) {
    setActive(id);
    setMinimized(false);
  }
  function dragWindow(event) {
    if (event.button !== 0 || event.target.closest("button") || maximized)
      return;
    const rect = screenRef.current.getBoundingClientRect();
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      start: position,
      scale: rect.width / screenRef.current.clientWidth,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveWindow(event) {
    const drag = dragRef.current;
    if (!drag) return;
    const limitX = screenRef.current.clientWidth * 0.11;
    const limitY = screenRef.current.clientHeight * 0.09;
    setPosition({
      x: Math.max(
        -limitX,
        Math.min(limitX, drag.start.x + (event.clientX - drag.x) / drag.scale),
      ),
      y: Math.max(
        -limitY,
        Math.min(limitY, drag.start.y + (event.clientY - drag.y) / drag.scale),
      ),
    });
  }

  return (
    <div
      className="classic-desktop"
      ref={screenRef}
      aria-label="HE CHENGHAO's desktop"
    >
      <div className="os-menu">
        <button
          className="os-menu-home"
          onClick={() => openApp("home")}
          aria-label="Go to desktop home"
        >
          ◈
        </button>
        <strong>Finder</strong>
        <button onClick={() => openApp("projects")}>File</button>
        <button onClick={() => openApp("about")}>View</button>
        <button onClick={onExit}>Back</button>
        <span>
          {new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(now)}
        </span>
      </div>
      <nav className="desktop-icons" aria-label="Desktop shortcuts">
        {apps
          .filter((app) => app.id !== "home")
          .map((app) => (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              aria-label={`Open ${app.title}`}
            >
              <span>
                <Icon name={app.icon} size={44} />
              </span>
              {app.title}
            </button>
          ))}
        <a href={profile.github} target="_blank" rel="noreferrer">
          <span>
            <Icon name="github" size={43} />
          </span>
          GitHub
        </a>
      </nav>
      <section
        hidden={minimized}
        className={`classic-window ${maximized ? "maximized" : ""}`}
        style={
          maximized
            ? undefined
            : { transform: `translate(${position.x}px, ${position.y}px)` }
        }
        aria-labelledby="window-title"
      >
        <div
          className="window-titlebar"
          onPointerDown={dragWindow}
          onPointerMove={moveWindow}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
        >
          <button
            className="window-close"
            aria-label="Close window"
            onClick={() => setMinimized(true)}
          />
          <span className="title-stripes" />
          <h2 id="window-title">
            {active === "home"
              ? `${profile.name}'s Portfolio`
              : selected.english}
          </h2>
          <span className="title-stripes" />
          <button
            className="window-minimize"
            aria-label="Minimize window"
            onClick={() => setMinimized(true)}
          >
            −
          </button>
          <button
            className="window-maximize"
            aria-label={maximized ? "Restore window size" : "Maximize window"}
            onClick={() => {
              setMaximized(!maximized);
              setPosition({ x: 0, y: 0 });
            }}
          >
            <span />
          </button>
        </div>
        <div className="window-body">
          {active !== "home" && (
            <nav className="classic-sidebar" aria-label="Portfolio navigation">
              <strong>
                Ho<span>ho2006</span>
              </strong>
              {apps.map((app) => (
                <button
                  key={app.id}
                  aria-pressed={active === app.id}
                  onClick={() => openApp(app.id)}
                >
                  {app.english}
                </button>
              ))}
            </nav>
          )}
          <div className="window-content" key={active}>
            {active === "home" && (
              <div className="desktop-welcome">
                <HappyMac />
                <h2>{profile.name}</h2>
                <h3>Independent Developer</h3>
                <p>
                  {profile.role} / {profile.education}
                </p>
                <nav aria-label="Home navigation">
                  {apps
                    .filter((app) => app.id !== "home")
                    .map((app) => (
                      <button key={app.id} onClick={() => openApp(app.id)}>
                        {app.english}
                      </button>
                    ))}
                </nav>
                <small>Welcome to my little corner of the internet.</small>
              </div>
            )}
            {active === "about" && (
              <>
                <div className="document-heading">
                  <h2>About me.</h2>
                  <p>A little about the person behind the code.</p>
                </div>
                <AboutContent />
              </>
            )}
            {active === "projects" && (
              <>
                <div className="document-heading">
                  <h2>Selected work.</h2>
                  <p>
                    {projects.length} public projects, from an idea to a commit.
                  </p>
                </div>
                <ProjectExplorer projects={projects} />
              </>
            )}
            {active === "honors" && (
              <>
                <div className="document-heading">
                  <h2>Milestones.</h2>
                  <p>Awards, certificates, and milestones.</p>
                </div>
                <Honors />
              </>
            )}
            {active === "contact" && (
              <div className="classic-contact">
                <Icon name="mail" size={58} />
                <h2>Say hello.</h2>
                <p>Let's talk about projects, technology, and new ideas.</p>
                <ContactLinks />
                <a
                  className="contact-github"
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="github" size={22} />
                  github.com/{profile.handle}
                  <Icon name="external" size={19} />
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="window-status">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>
            {active === "projects"
              ? `${projects.length} items`
              : `${selected.english.toLowerCase()}.txt`}
          </span>
          <span className="resize-grip" aria-hidden="true">
            ◩
          </span>
        </div>
      </section>
      {minimized && (
        <button className="restore-window" onClick={() => setMinimized(false)}>
          <Icon name={selected.icon} size={22} />
          Restore {selected.title} window
        </button>
      )}
    </div>
  );
}
