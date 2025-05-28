import { expect, test, vi } from 'vitest';
import { sayHello } from '../src/utils/helper.js';

test('sayHello logs to console', () => {
  const spy = vi.spyOn(console, 'log');
  sayHello();
  expect(spy).toHaveBeenCalledWith('Hello from helper!');
  spy.mockRestore();
});
