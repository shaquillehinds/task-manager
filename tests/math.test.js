const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } = require("../server/math");
const add = (a, b) => a + b;
test("Should add two numbers", () => {
  const result = add(1, 2);
  expect(result).toBe(3);
});

test("Should return total with tip", () => {
  const result = calculateTip(100, 15);
  expect(result).toBe(115);
});
test("should calculate total with default tip", () => {
  const result = calculateTip(100);
  expect(result).toBe(125);
});
test("should convert fahrenheit to celcius", () => {
  const result = fahrenheitToCelsius(32);
  expect(result).toBe(0);
});
test("should convert celcius to fahrenheit", () => {
  const result = celsiusToFahrenheit(0);
  expect(result).toBe(32);
});

test("Async test demo", (done) => {
  setTimeout(() => {
    expect(2).toBe(2);
    done();
  }, 2000);
});
