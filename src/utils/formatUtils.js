/**
 * Utility functions for formatting and displaying data
 */

// Format spend amounts to "X.XXX억 원" format with 3 decimal places
export function formatSpend(sum) {
  // Convert to billions, round at 4th decimal place, then format to 3 decimal places
  return `${(Math.round((sum / 1e8) * 10000) / 10000).toFixed(3)}억 원`;
}

// Format total spend amount with just 1 decimal place for the top-level display
export function formatTotalSpend(sum) {
  // Convert to billions, round at 2nd decimal place, then format to 1 decimal place
  return `${(Math.round((sum / 1e8) * 10) / 10).toFixed(1)}억 원`;
}

// Helper to format spec, color, form for display
export function formatSpecDetail(item) {
  const parts = [];
  if (item.spec) parts.push(`Spec: ${item.spec}`);
  if (item.color) parts.push(`Color: ${item.color}`);
  if (item.form) parts.push(`Form: ${item.form}`);
  const fullText = parts.join(' / ');
  // 글자수 제한: 최대 70자
  const maxLen = 70;
  let displayText = fullText;
  if (fullText.length > maxLen) {
    displayText = fullText.slice(0, maxLen) + '...';
  }
  return { displayText, fullText };
}

// Helper: 30자 초과 시 두 줄로 나누기
export function twoLineText(str, max = 30) {
  if (!str) return '';
  if (str.length <= max) return str;
  const words = str.split(' ');
  let line1 = '';
  let line2 = '';
  for (let w of words) {
    if ((line1 + ' ' + w).trim().length <= max) {
      line1 = (line1 + ' ' + w).trim();
    } else {
      line2 += (line2 ? ' ' : '') + w;
    }
  }
  if (!line2) {
    line1 = str.slice(0, max);
    line2 = str.slice(max);
  }
  return line1 + '\n' + line2;
} 
 
 
 
 
 
 