import { projectDetails } from "./profile.js";

export function buildProjects(repos) {
  return repos
    .filter(
      (repo) =>
        repo.private === false &&
        repo.fork === false &&
        repo.archived === false &&
        repo.html_url === `https://github.com/ho2006/${repo.name}`,
    )
    .map((repo) => ({
      ...repo,
      ...projectDetails[repo.name],
      title: projectDetails[repo.name]?.title || repo.name,
      category: projectDetails[repo.name]?.category || "Other",
      description:
        projectDetails[repo.name]?.description ||
        (repo.description && !/\p{Script=Han}/u.test(repo.description)
          ? repo.description
          : null) ||
        "Explore the source code and details on GitHub.",
      tags: projectDetails[repo.name]?.tags || [repo.language].filter(Boolean),
    }))
    .sort(
      (a, b) =>
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        b.stargazers_count - a.stargazers_count ||
        b.updated_at.localeCompare(a.updated_at),
    );
}

export function filterProjects(projects, category, query) {
  const term = query.trim().toLocaleLowerCase();
  return projects.filter(
    (project) =>
      (category === "All" || project.category === category) &&
      `${project.name} ${project.title} ${project.description} ${project.tags.join(" ")}`
        .toLocaleLowerCase()
        .includes(term),
  );
}
