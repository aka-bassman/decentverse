import { render } from "@testing-library/react";

import Reactverse from "./reactverse";

describe("Reactverse", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Reactverse />);
    expect(baseElement).toBeTruthy();
  });
});
