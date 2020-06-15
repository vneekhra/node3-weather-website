
function sum(a, b) {
  return a+b;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('adds 10 + 20 to equal 30', () => {
  expect(sum(10, 20)).toBe(30);
});

test('adds 15 + 12 to equal 27', () => {
  expect(sum(15, 12)).toBe(27);
});