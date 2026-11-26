const MAX_U64 = 18446744073709551615n;

/** Wire counters are canonical decimal strings, never floating-point numbers. */
export function parseCounter(value: unknown): bigint {
  if (typeof value !== "string" || !/^(0|[1-9][0-9]{0,19})$/.test(value)) {
    throw new RangeError("Invalid unsigned counter");
  }
  const counter = BigInt(value);
  if (counter > MAX_U64) throw new RangeError("Counter overflow");
  return counter;
}
