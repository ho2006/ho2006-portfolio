import { useState } from "react";
import { filterProjects } from "../data/projects.js";
import Icon from "./Icon.jsx";

export default function ProjectExplorer({ projects }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];
  const filtered = filterProjects(projects, category, query);
  return (
    <div className="project-explorer">
      <div className="explorer-toolbar">
        <div
          className="filter-buttons"
          role="group"
          aria-label="Project categories"
        >
          {categories.map((item) => (
            <button
              key={item}
              aria-pressed={item === category}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" size={16} />
          <input
            aria-label="Search projects"
            type="search"
            placeholder="Search projects or tech…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="project-list">
        {filtered.map((project) => (
          <a
            key={project.id}
            className="project-row"
            href={project.html_url}
            target="_blank"
            rel="noreferrer"
          >
            <span
              className={`folder-icon category-${project.category === "Data Research" ? "research" : project.category === "Desktop Tools" ? "tool" : "web"}`}
            >
              <Icon name="folder" size={23} />
            </span>
            <span className="project-row-copy">
              <strong>{project.title}</strong>
              <span>{project.description}</span>
            </span>
            <span className="row-language">{project.language || "—"}</span>
            <span className="row-stars">
              <Icon name="star" size={13} /> {project.stargazers_count}
            </span>
            <Icon name="external" size={18} />
          </a>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-search">
          <Icon name="search" size={28} />
          <p>No matching projects</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <div className="explorer-status" aria-live="polite">
        {filtered.length} projects{" "}
        <span>Public repositories · GitHub @ho2006</span>
      </div>
    </div>
  );
}
