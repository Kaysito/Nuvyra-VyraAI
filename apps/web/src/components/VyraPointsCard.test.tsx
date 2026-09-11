import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VyraPointsCard } from "./VyraPointsCard";

describe("VyraPointsCard", () => {
  it("shows the initial level and accessible progress", () => {
    render(<VyraPointsCard points={0} />);

    expect(screen.getByRole("heading", { name: "VyraPoints" })).toBeInTheDocument();
    expect(screen.getByText("0 pts")).toBeInTheDocument();
    expect(screen.getByText("Nivel 1")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText("100 puntos para alcanzar el Nivel 2.")).toBeInTheDocument();
  });

  it("shows partial progress and points remaining", () => {
    render(<VyraPointsCard points={50} />);

    expect(screen.getByText("50 pts")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByText("50 puntos para alcanzar el Nivel 2.")).toBeInTheDocument();
  });

  it("communicates the next level after crossing the threshold", () => {
    render(<VyraPointsCard points={100} />);

    expect(screen.getByText("Nivel 2")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByText("100 puntos para alcanzar el Nivel 3.")).toBeInTheDocument();
    expect(screen.getByText(/no representan dinero/i)).toBeInTheDocument();
  });
});
