import { create } from 'zustand';

export const useDashboardStore = create((set, get) => ({
  cardData: null,
  uniqueGroupCount: 0,
  uniqueMaterialCodeCount: 0,
  totalSpend: 0,
  dateRange: '',
  monthlySpendByGroup: null,
  topItemSuppliersByGroup: {},
  setDashboard: (data) => set(data),
  resetDashboard: () => set({
    cardData: null,
    uniqueGroupCount: 0,
    uniqueMaterialCodeCount: 0,
    totalSpend: 0,
    dateRange: '',
    monthlySpendByGroup: null,
    topItemSuppliersByGroup: {},
  }),
  loadFromStorage: () => {
    const saved = localStorage.getItem('dashboardData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        set({
          cardData: parsed.cardData,
          uniqueGroupCount: parsed.uniqueGroupCount,
          uniqueMaterialCodeCount: parsed.uniqueMaterialCodeCount,
          totalSpend: parsed.totalSpend,
          dateRange: parsed.dateRange,
          monthlySpendByGroup: parsed.monthlySpendByGroup || null,
          topItemSuppliersByGroup: parsed.topItemSuppliersByGroup || {},
        });
      } catch (e) {}
    }
  },
  saveToStorage: () => {
    const { cardData, uniqueGroupCount, uniqueMaterialCodeCount, totalSpend, dateRange, monthlySpendByGroup, topItemSuppliersByGroup } = get();
    localStorage.setItem('dashboardData', JSON.stringify({
      cardData,
      uniqueGroupCount,
      uniqueMaterialCodeCount,
      totalSpend,
      dateRange,
      monthlySpendByGroup,
      topItemSuppliersByGroup,
    }));
  },
})); 