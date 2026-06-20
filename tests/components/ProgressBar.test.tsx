import { render, screen } from "@testing-library/react";
import { ProgressBar } from "@/components/ui/ProgressBar";

describe("ProgressBar", () => {
  it("renders with 0% width", () => {
    render(<ProgressBar progress={0} />);
    const bar = document.querySelector(".bg-green-500");
    expect(bar?.getAttribute("style")).toContain("width: 0%");
  });

  it("renders with 50% width", () => {
    render(<ProgressBar progress={50} />);
    const bar = document.querySelector(".bg-green-500");
    expect(bar?.getAttribute("style")).toContain("width: 50%");
  });

  it("clamps progress to 100%", () => {
    render(<ProgressBar progress={150} />);
    const bar = document.querySelector(".bg-green-500");
    expect(bar?.getAttribute("style")).toContain("width: 100%");
  });
  
  it("renders without crashing", () => {
    render(<ProgressBar progress={75} />);
    expect(document.querySelector(".h-2")).toBeInTheDocument();
  });
});
