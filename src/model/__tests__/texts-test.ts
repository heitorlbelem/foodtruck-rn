import { ApiError } from '@/api/http';
import { errorMessage } from '@/model/texts';

test('translates FORBIDDEN', () => {
  expect(errorMessage(new ApiError('FORBIDDEN', 403))).toBe('Você não tem permissão para isso.');
});
