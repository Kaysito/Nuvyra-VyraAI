import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("App", () => {
  it("renders the main welcome heading", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /tu dinero merece una perspectiva más clara/i })).toBeInTheDocument();
  });
});
