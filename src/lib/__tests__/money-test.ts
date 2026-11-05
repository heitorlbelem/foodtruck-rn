import { formatPrice, maskPrice, parsePrice } from '@/lib/money';

test('maskPrice fills cents from the right', () => {
  expect(maskPrice('2')).toBe('0,02');
  expect(maskPrice('125000')).toBe('1.250,00');
  expect(maskPrice('0,0')).toBe('');
  expect(maskPrice('100000001')).toBeNull();
});

test('parsePrice reads what maskPrice writes', () => {
  expect(parsePrice('1.250,00')).toBe(125000);
  expect(formatPrice(2500)).toBe('R$ 25,00');
});
