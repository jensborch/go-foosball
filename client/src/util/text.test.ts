import { responsiveTxt } from "./text";

test("text to end with ...", () => {
  const txt = responsiveTxt("123456", 5);
  expect(txt).toEqual("12345...");
});

test("text to be the same", () => {
  const txt = responsiveTxt("12345", 5);
  expect(txt).toEqual("12345");
});
