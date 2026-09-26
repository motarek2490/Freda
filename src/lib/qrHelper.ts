import QRCode from 'qrcode';

export async function generateQrCodeDataUrl(text: string): Promise<string> {
  if (!text) return '';
  try {
    // Robust ESM/CJS interop fallback
    const qrObj = (QRCode as any)?.default || QRCode;
    const toDataURLFn = qrObj?.toDataURL || (QRCode as any)?.toDataURL;
    
    if (typeof toDataURLFn === 'function') {
      return await toDataURLFn(text, {
        width: 250,
        margin: 1,
        color: { dark: '#171717', light: '#FFFFFF' },
      });
    }
    
    // Primary Fallback: Use public secure API if local library fails to load
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}&color=171717&bgcolor=ffffff&qzone=1`;
  } catch (err) {
    console.warn('QR code generation failed, falling back to secure API:', err);
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}&color=171717&bgcolor=ffffff&qzone=1`;
  }
}
