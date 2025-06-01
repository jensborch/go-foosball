import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App basename="/" />);
  const progressbar = screen.getByLabelText("Home");
  expect(progressbar).toBeInTheDocument();
});
