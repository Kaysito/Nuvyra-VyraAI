import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const themesCss = readFileSync("src/themes.css", "utf8");

describe("theme stylesheet capabilities", () => {
  it("keeps responsive and accessibility safeguards", () => {
    expect(themesCss).toContain("@media (max-width: 1050px)");
    expect(themesCss).toContain("@media (max-width: 760px)");
    expect(themesCss).toContain("@media (prefers-reduced-motion: reduce)");
    expect(themesCss).toContain("@media (prefers-reduced-transparency: reduce)");
    expect(themesCss).toContain("@media (forced-colors: active)");
    expect(themesCss).toContain("@supports not (backdrop-filter: blur(1px))");
    expect(themesCss).toContain(".meter i");
  });
});
