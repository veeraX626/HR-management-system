import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import HomePage from "@/app/page";

describe("home page", () => {
  it("renders hero text", () => {
    const { getByText } = render(<HomePage />);
    expect(getByText(/Ship a full stack MVP/)).toBeTruthy();
  });
});
