export function getSourceIcon(url: string, source?: string): string {
  // First try to determine from explicit source
  if (source) {
    const sourceLower = source.toLowerCase();
    if (sourceLower.includes('linkedin')) return '/images/platforms/linkedin.svg';
    if (sourceLower.includes('indeed')) return '/images/platforms/indeed.webp';
    if (sourceLower.includes('glassdoor')) return '/images/platforms/glassdoor.svg';
    if (sourceLower.includes('google')) return '/images/platforms/google.png';
  }
  
  // Fallback to URL-based detection
  if (url.includes('linkedin.com')) return '/images/platforms/linkedin.svg';
  if (url.includes('indeed.com')) return '/images/platforms/indeed.webp';
  if (url.includes('glassdoor.com')) return '/images/platforms/glassdoor.svg';
  if (url.includes('google.com')) return '/images/platforms/google.png';
  
  // Default icon
  return '/images/platforms/default.png';
}
