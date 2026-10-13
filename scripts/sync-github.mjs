import { writeFile, rename } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const owner = "ho2006";

export function publicRepositories(repos) {
  if (!Array.isArray(repos))
    throw new Error("GitHub response is not a repository list.");
  const seen = new Set();
  return repos
    .filter(
      (repo) =>
        repo.private === false &&
        repo.fork === false &&
        repo.archived === false &&
        repo.size > 0,
    )
    .map((repo) => {
      if (
        repo.owner?.login !== owner ||
        !/^[a-zA-Z0-9_.-]+$/.test(repo.name) ||
        repo.html_url !== `https://github.com/${owner}/${repo.name}` ||
        !Number.isSafeInteger(repo.id) ||
        repo.id <= 0 ||
        seen.has(repo.id)
      )
        throw new Error(
          "Invalid repository identity or URL. Previous snapshot retained.",
        );
      if (
        ![repo.stargazers_count, repo.forks_count].every(
          (count) => Number.isSafeInteger(count) && count >= 0,
        ) ||
        typeof repo.updated_at !== "string" ||
        !Number.isFinite(Date.parse(repo.updated_at))
      )
        throw new Error(
          "Invalid repository statistics or date. Previous snapshot retained.",
        );
      if (
        ![repo.description, repo.language, repo.homepage].every(
          (value) => value == null || typeof value === "string",
        )
      )
        throw new Error(
          "Invalid repository metadata. Previous snapshot retained.",
        );
      seen.add(repo.id);
      return Object.fromEntries(
        [
          "id",
          "name",
          "description",
          "html_url",
          "homepage",
          "language",
          "stargazers_count",
          "forks_count",
          "topics",
          "updated_at",
          "fork",
          "private",
          "archived",
        ].map((key) => [
          key,
          key === "topics"
            ? Array.isArray(repo.topics)
              ? repo.topics.filter((topic) => typeof topic === "string")
              : []
            : repo[key],
        ]),
      );
    });
}

async function sync() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ho2006-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const repos = [];
  for (let page = 1; ; page++) {
    const response = await fetch(
      `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated&page=${page}`,
      { headers, signal: AbortSignal.timeout(20000) },
    );
    if (!response.ok)
      throw new Error(
        `GitHub HTTP ${response.status}. Snapshot unchanged. For rate limits, set GITHUB_TOKEN locally and retry.`,
      );
    const batch = await response.json();
    if (!Array.isArray(batch))
      throw new Error("Invalid GitHub response. Snapshot unchanged.");
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  const publicRepos = publicRepositories(repos);
  if (!publicRepos.length)
    throw new Error("No public projects found. Snapshot unchanged.");
  const snapshot = {
    fetchedAt: new Date().toISOString().slice(0, 10),
    source: `https://github.com/${owner}`,
    repos: publicRepos,
  };
  const destination = fileURLToPath(
    new URL("../src/data/github.json", import.meta.url),
  );
  const temporary = `${destination}.tmp`;
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await rename(temporary, destination);
  console.log(
    `Updated ${publicRepos.length} original public projects. Rebuild and redeploy to publish the update.`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  sync().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
