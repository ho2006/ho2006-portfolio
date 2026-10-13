import { useState } from "react";
import { profile } from "../data/profile.js";
import Icon from "./Icon.jsx";

export function Honors() {
  if (!profile.honors.length)
    return (
      <div className="honors-empty">
        <span className="honor-illustration">
          <Icon name="award" size={35} />
        </span>
        <div>
          <h3>More milestones ahead.</h3>
          <p>
            A place for future awards, certificates, and meaningful milestones.
          </p>
          <span className="honor-note">Honors archive · To be added</span>
        </div>
      </div>
    );
  return (
    <div className="honors-list">
      {profile.honors.map((honor) => (
        <article key={`${honor.year}-${honor.title}`}>
          <span>{honor.year}</span>
          <div>
            <h3>{honor.title}</h3>
            <p>{honor.issuer}</p>
            {honor.description && <p>{honor.description}</p>}
            {honor.url?.startsWith("https://") && (
              <a href={honor.url} target="_blank" rel="noreferrer">
                View certificate <Icon name="external" size={16} />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export function ContactLinks() {
  const [status, setStatus] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("Email copied");
    } catch {
      setStatus(`Copy manually: ${profile.email}`);
    }
  }
  return (
    <div className="contact-links">
      <a className="email-link" href={`mailto:${profile.email}`}>
        {profile.email}
        <Icon name="external" size={21} />
      </a>
      <button
        className="copy-button"
        onClick={copyEmail}
        aria-label="Copy email address"
      >
        <Icon name={status === "Email copied" ? "check" : "copy"} size={17} />
      </button>
      <span className="copy-status" role="status">
        {status}
      </span>
    </div>
  );
}

export function AboutContent() {
  return (
    <div className="about-content">
      <div className="profile-heading">
        <img
          src={profile.avatar}
          alt="HE CHENGHAO's GitHub avatar"
          width="64"
          height="64"
          loading="lazy"
        />
        <div>
          <h3>{profile.name}</h3>
          <span>@{profile.handle}</span>
        </div>
      </div>
      <p>{profile.intro}</p>
      <div className="profile-facts">
        <div>
          <span>Role</span>
          <strong>{profile.role}</strong>
        </div>
        <div>
          <span>Education</span>
          <strong>{profile.education}</strong>
        </div>
        <div>
          <span>Exploring</span>
          <strong>AI / Desktop Tools / Data Research</strong>
        </div>
      </div>
      <div className="skill-tags">
        {["TypeScript", "Python", "React", "C#", "PyTorch", "SQL"].map(
          (skill) => (
            <span key={skill}>{skill}</span>
          ),
        )}
      </div>
    </div>
  );
}
