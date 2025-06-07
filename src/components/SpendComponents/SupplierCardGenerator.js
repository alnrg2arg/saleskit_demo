import { formatDate } from '../../utils/dateUtils';

/**
 * Generate supplier card data for display
 * @param {Array} topSuppliers - Array of supplier names
 * @param {Object} supplierMetrics - Object containing supplier metrics
 * @returns {Array} Array of supplier card data objects
 */
export const generateSupplierCards = (
  topSuppliers, 
  { 
    supplierSpendMap, 
    supplierLastDateMap, 
    supplierOrderCountMap, 
    supplierQuantityMap, 
    supplierUnitMap, 
    supplierLastPriceMap 
  }
) => {
  // Get up to 4 suppliers
  const topFourSuppliers = topSuppliers.slice(0, 4);
  
  // Create card objects for each supplier
  return topFourSuppliers.map(supplier => {
    const supplierName = supplier;
    // Round at 4th decimal place for consistency with formatSpend in formatUtils.js
    const supplierSpend = supplier ? Math.round((supplierSpendMap[supplier] || 0) / 1e8 * 10000) / 10000 : 0;
    const lastDate = supplier ? formatDate(supplierLastDateMap[supplier]) : '-';
    const orderCount = supplier ? (supplierOrderCountMap[supplier] || 0) : 0;
    const quantity = supplier ? (supplierQuantityMap[supplier] || 0) : 0;
    const unit = supplier ? (supplierUnitMap[supplier] || '장') : '장';
    const lastPrice = supplier ? (supplierLastPriceMap[supplier] || 0) : 0;
    
    return {
      supplierName,
      supplierSpend,
      lastDate,
      orderCount,
      quantity,
      unit,
      lastPrice
    };
  });
}; 
 
 
 
 
 
 