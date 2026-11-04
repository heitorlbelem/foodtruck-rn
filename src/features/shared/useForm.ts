import { useState } from 'react';

type Errors<T> = Partial<Record<keyof T, string>>;

/**
 * Values of a panel form, per-field errors and whether anything changed.
 * Changing a field clears its error.
 */
export function useForm<T extends object>(initial: T) {
  const [initialValues] = useState(initial);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors<T>>({});

  function set<K extends keyof T>(key: K, value: T[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  /** Shows the errors and returns true when the form is valid. */
  function validate(next: Errors<T>) {
    setErrors(next);
    return Object.values(next).every((e) => !e);
  }

  return {
    values,
    set,
    errors,
    setErrors,
    validate,
    dirty: JSON.stringify(values) !== JSON.stringify(initialValues),
  };
}
