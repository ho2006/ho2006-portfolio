import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Box3, Vector3 } from "three";
import { buildProjects, filterProjects } from "../src/data/projects.js";
import { profile } from "../src/data/profile.js";
import { createMacbook, disposeMacbook } from "../src/lib/macbook.js";
import { publicRepositories } from "../scripts/sync-github.mjs";
import { fitDistance } from "../src/lib/camera.js";

const snapshot = JSON.parse(
  readFileSync(new URL("../src/data/github.json", import.meta.url), "utf8"),
);
const projects = buildProjects(snapshot.repos);

test("Portfolio uses public projects and the supplied profile", () => {
  assert.equal(profile.name, "HE CHENGHAO");
  assert.equal(profile.education, "Undergraduate at Shandong University");
  assert.ok(projects.length >= 10);
  assert.equal(projects.filter((project) => project.featured).length, 3);
  assert.equal(
    new Set(projects.map((project) => project.id)).size,
    projects.length,
  );
  assert.ok(
    projects.every(
      (project) =>
        project.private === false &&
        project.html_url.startsWith("https://github.com/ho2006/"),
    ),
  );
  assert.deepEqual(profile.honors, []);
  assert.ok(
    [
      profile.role,
      profile.education,
      profile.intro,
      ...projects.flatMap(({ title, category, description }) => [
        title,
        category,
        description,
      ]),
    ].every((text) => !/\p{Script=Han}/u.test(text)),
  );
  const untranslated = buildProjects([
    {
      ...snapshot.repos[0],
      name: "new-project",
      html_url: "https://github.com/ho2006/new-project",
      description: "\u9879\u76ee\u63cf\u8ff0",
    },
  ]);
  assert.equal(
    untranslated[0].description,
    "Explore the source code and details on GitHub.",
  );
});

test("Filters support names, technology, whitespace, and empty results", () => {
  assert.equal(
    filterProjects(projects, "All", " INCENTIVESCOPE ")[0].name,
    "IncentiveScope",
  );
  assert.equal(
    filterProjects(projects, "Desktop Tools", "pixel")[0].name,
    "clash-pet",
  );
  assert.ok(filterProjects(projects, "Data Research", "Python").length >= 3);
  assert.equal(filterProjects(projects, "Web Apps", "clash").length, 0);
  assert.equal(filterProjects(projects, "All", "no-such-project").length, 0);
  assert.equal(filterProjects(projects, "All", "").length, projects.length);
});

test("Private, forked, archived, and invalid repositories are excluded", () => {
  const repo = snapshot.repos[0];
  assert.equal(
    buildProjects([
      { ...repo, private: true },
      { ...repo, fork: true },
      { ...repo, archived: true },
      { ...repo, fork: undefined },
      { ...repo, html_url: "javascript:alert(1)" },
    ]).length,
    0,
  );
  const raw = { ...repo, owner: { login: "ho2006" }, size: 10 };
  assert.equal(
    publicRepositories([
      raw,
      { ...raw, private: true },
      { ...raw, private: undefined },
    ]).length,
    1,
  );
  assert.throws(() =>
    publicRepositories([{ ...raw, owner: { login: "other-user" } }]),
  );
  assert.throws(() => publicRepositories([{ ...raw, stargazers_count: -1 }]));
  assert.throws(() => publicRepositories([{ ...raw, updated_at: "invalid" }]));
  assert.throws(() => publicRepositories([raw, raw]));
  assert.throws(() => publicRepositories({ message: "rate limited" }));
});

test("Original Air model has a clickable 16:10 screen and a separate hinge", () => {
  const { laptop, lid, screen } = createMacbook();
  assert.equal(lid.name, "lid");
  assert.equal(screen.parent, lid);
  assert.equal(lid.parent, laptop);
  assert.equal(screen.name, "screen");
  assert.equal(
    screen.geometry.parameters.width / screen.geometry.parameters.height,
    1.6,
  );
  assert.ok(laptop.children.length > 70);
  const bounds = new Box3().setFromObject(laptop).getSize(new Vector3());
  assert.ok(bounds.x > 6.5 && bounds.x < 7);
  assert.ok(bounds.y > 4 && bounds.y < 5);
  assert.ok(bounds.z > 4 && bounds.z < 6);
  laptop.traverse((object) => {
    if (object.isMesh)
      assert.ok(
        [...object.geometry.attributes.position.array].every(Number.isFinite),
      );
  });
  disposeMacbook(laptop);
});

test("Camera contains the 16:10 display in landscape and portrait", () => {
  for (const aspect of [16 / 9, 4 / 3, 390 / 844, 320 / 740]) {
    const distance = fitDistance(6.09, 6.09 / 1.6, aspect, 36);
    const visibleHeight = 2 * distance * Math.tan((18 * Math.PI) / 180);
    const visibleWidth = visibleHeight * aspect;
    assert.ok(Number.isFinite(distance) && distance > 0);
    assert.ok(visibleWidth >= 6.09 / 0.86 - 1e-10);
    assert.ok(visibleHeight >= 6.09 / 1.6 / 0.86 - 1e-10);
  }
});
