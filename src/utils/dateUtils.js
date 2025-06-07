/**
 * Utility functions for date handling
 */

// 엑셀 시리얼 넘버 및 다양한 날짜 포맷 지원
export function parseDateString(dateStr) {
  if (typeof dateStr === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + dateStr * 86400000);
  }
  if (typeof dateStr === "string") {
    dateStr = dateStr.trim();
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateStr)) {
      return new Date(dateStr.replace(/\./g, '-'));
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return new Date(dateStr);
    }
  }
  return null;
}

// 날짜 포맷 함수 정의
export function formatDate(date) {
  if (!date || isNaN(date)) return '-';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
} 
 
 
 
 
 
 
 