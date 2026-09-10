import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PULSE_QUESTIONS, type PulseAnswers } from "./pulseModel";
import { PulseV1View } from "./PulseV1View";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getOptionButton(label: string) {
  return screen.getByRole("button", { name: new RegExp(escapeRegExp(label), "i") });
}

async function completeQuestionnaire(values: PulseAnswers) {
  const user = userEvent.setup();

  for (const question of PULSE_QUESTIONS) {
    const value = values[question.dimension];
    const option = question.options.find(candidate => candidate.value === value);
    if (!option) throw new Error(`Missing option ${value} for ${question.dimension}`);
    await user.click(getOptionButton(option.label));
  }

  return user;
}

describe("PulseV1View", () => {
  it("renders the first question and its model options", () => {
    const onComplete = vi.fn();
    const firstQuestion = PULSE_QUESTIONS[0];

    render(<PulseV1View onComplete={onComplete} />);

    expect(screen.getByRole("heading", { name: firstQuestion.question })).toBeInTheDocument();
    expect(screen.getByLabelText("Pregunta 1 de 5")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Progreso del cuestionario pulse-v1" })).toHaveAttribute("aria-valuemin", "1");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", String(PULSE_QUESTIONS.length));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    expect(screen.getAllByRole("button")).toHaveLength(firstQuestion.options.length);

    for (const option of firstQuestion.options) {
      expect(getOptionButton(option.label)).toBeInTheDocument();
    }
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("progresses through every question and emits the exact profile", async () => {
    const onComplete = vi.fn();
    const answers: PulseAnswers = {
      experience: "beginner",
      riskDisposition: "medium",
      horizon: "long",
      objective: "growth",
      pressureResponse: "pauseAndReview",
    };
    const user = userEvent.setup();

    render(<PulseV1View onComplete={onComplete} />);

    for (const [index, question] of PULSE_QUESTIONS.entries()) {
      expect(screen.getByRole("heading", { name: question.question })).toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(index + 1));
      const option = question.options.find(candidate => candidate.value === answers[question.dimension]);
      if (!option) throw new Error(`Missing option for ${question.dimension}`);
      if (index === PULSE_QUESTIONS.length - 1) expect(onComplete).not.toHaveBeenCalled();
      await user.click(getOptionButton(option.label));
    }

    expect(screen.getByRole("heading", { name: PULSE_QUESTIONS[4].question })).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "5");
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith({
      ...answers,
      isProvisional: true,
      assessmentVersion: "pulse-v1",
    });
    expect(onComplete.mock.calls[0][0]).not.toHaveProperty("clarity");
    expect(onComplete.mock.calls[0][0]).not.toHaveProperty("score");
    expect(onComplete.mock.calls[0][0]).not.toHaveProperty("riskScore");
    expect(onComplete.mock.calls[0][0]).not.toHaveProperty("behavioralRiskScore");
    expect(onComplete.mock.calls[0][0]).not.toHaveProperty("behavioralSignal");
  });

  it("preserves unspecified and unsure options", async () => {
    const onComplete = vi.fn();
    render(<PulseV1View onComplete={onComplete} />);
    await completeQuestionnaire({
      experience: "beginner",
      riskDisposition: "low",
      horizon: "unspecified",
      objective: "unspecified",
      pressureResponse: "unsure",
    });

    expect(onComplete).toHaveBeenCalledWith({
      experience: "beginner",
      riskDisposition: "low",
      horizon: "unspecified",
      objective: "unspecified",
      pressureResponse: "unsure",
      isProvisional: true,
      assessmentVersion: "pulse-v1",
    });
  });

  it("supports the first valid option for every dimension", async () => {
    const onComplete = vi.fn();
    render(<PulseV1View onComplete={onComplete} />);
    await completeQuestionnaire({
      experience: "beginner",
      riskDisposition: "low",
      horizon: "short",
      objective: "preservation",
      pressureResponse: "actNow",
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("supports the last valid option for every dimension", async () => {
    const onComplete = vi.fn();
    render(<PulseV1View onComplete={onComplete} />);
    await completeQuestionnaire({
      experience: "advanced",
      riskDisposition: "high",
      horizon: "unspecified",
      objective: "unspecified",
      pressureResponse: "unsure",
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("advances when an option receives focus and is activated with Enter", async () => {
    const user = userEvent.setup();
    render(<PulseV1View onComplete={vi.fn()} />);
    await user.tab();

    const firstOption = getOptionButton(PULSE_QUESTIONS[0].options[0].label);
    expect(firstOption).toHaveFocus();
    await user.keyboard("{Enter}");

    const secondHeading = screen.getByRole("heading", { name: PULSE_QUESTIONS[1].question });
    expect(secondHeading).toBeInTheDocument();
    expect(secondHeading).toHaveFocus();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  });

  it("advances when an option is activated with Space", async () => {
    const user = userEvent.setup();
    render(<PulseV1View onComplete={vi.fn()} />);
    await user.tab();
    await user.keyboard(" ");

    expect(screen.getByRole("heading", { name: PULSE_QUESTIONS[1].question })).toHaveFocus();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  });

  it("calls onComplete only once if the final option is activated twice", async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    const answers: PulseAnswers = {
      experience: "beginner",
      riskDisposition: "medium",
      horizon: "long",
      objective: "growth",
      pressureResponse: "pauseAndReview",
    };

    render(<PulseV1View onComplete={onComplete} />);
    for (const question of PULSE_QUESTIONS.slice(0, -1)) {
      const option = question.options.find(candidate => candidate.value === answers[question.dimension]);
      if (!option) throw new Error(`Missing option for ${question.dimension}`);
      await user.click(getOptionButton(option.label));
    }

    const finalOption = PULSE_QUESTIONS.at(-1)?.options.find(option => option.value === answers.pressureResponse);
    if (!finalOption) throw new Error("Missing final option");
    await user.click(getOptionButton(finalOption.label));
    await user.click(getOptionButton(finalOption.label));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
