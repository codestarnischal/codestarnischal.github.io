export async function sha256Hex(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const enc = new TextEncoder();
    const data = enc.encode(input);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const bytes = Array.from(new Uint8Array(hash));
    return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback dynamic import to js-sha256 for non-browser (tests)
  const { sha256 } = await import('js-sha256');
  return sha256(input);
}