/**
 * Type guard function
 * @param value
 * @returns
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export { isString };
