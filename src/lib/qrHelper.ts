import QRCode from 'qrcode';

export async function generateQrCodeDataUrl(text: string): Promise<string> {
  if (!text) return '';
  try {
    const qrObj = (QRCode as any)?.default || QRCode;
    const toDataURLFn = qrObj?.toDataURL || (QRCode as any)?.toDataURL;

    if (typeof toDataURLFn === 'function') {
      return await toDataURLFn(text, {
        width: 280,
        margin: 1,
        color: { dark: '#171717', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
      });
    }

    // Local in-memory SVG fallback (100% offline, zero network requests)
    const toStringFn = qrObj?.toString || (QRCode as any)?.toString;
    if (typeof toStringFn === 'function') {
      const svg = await toStringFn(text, {
        type: 'svg',
        margin: 1,
        color: { dark: '#171717', light: '#FFFFFF' },
      });
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    return '';
  } catch (err) {
    console.warn('Local QR generation error:', err);
    try {
      const qrObj = (QRCode as any)?.default || QRCode;
      const svg = await qrObj.toString(text, { type: 'svg', margin: 1 });
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    } catch {
      return '';
    }
  }
}
