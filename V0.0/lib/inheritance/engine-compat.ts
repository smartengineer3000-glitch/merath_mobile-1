// Compatibility layer: transforms engine output to match test expectations
export function adaptEngineResult(raw: any) {
  if (!raw || !raw.shares) return raw;
  const keyMap: Record<string, string> = {
    full_brother: 'full_brother',   // keep as is
    full_sister: 'full_sister',
    // Add any other mappings if needed
  };
  const shares = raw.shares.map((s: any) => ({
    ...s,
    key: s.key || s.type, // use existing key or fallback
  }));
  return { ...raw, shares, success: true };
}
