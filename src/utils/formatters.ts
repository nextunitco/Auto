export function formatCurrency(amount: number, symbol = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  // Clean phone number: remove +, -, spaces
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  // If starts with 0 (e.g. 08111621502), convert to Nigerian international prefix 234
  if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = '234' + cleanPhone.slice(1);
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildEmailMailto(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}
