/**
 * Utility functions for data processing 
 */

import { parseDateString } from './dateUtils';

// Calculate supplier metrics for a given item
export function calculateSupplierMetrics(rows, topItemName) {
  if (!topItemName || !rows || rows.length === 0) {
    return {
      supplierSpendMap: {},
      supplierLastDateMap: {},
      supplierOrderCountMap: {},
      supplierQuantityMap: {},
      supplierUnitMap: {},
      supplierLastPriceMap: {},
      supplierLastSpendMap: {},
      topSuppliers: []
    };
  }

  let supplierSpendMap = {};
  let supplierLastDateMap = {};
  let supplierOrderCountMap = {};
  let supplierQuantityMap = {};
  let supplierUnitMap = {};
  let supplierLastPriceMap = {};
  let supplierLastSpendMap = {};
  
  rows.filter(r => r.material_name === topItemName).forEach(r => {
    const s = r.supplier || '';
    if (!s) return;
    
    // 해당 공급업체에 대한 총 spend 합계 계산
    supplierSpendMap[s] = (supplierSpendMap[s] || 0) + (Number(r.spend) || 0);
    
    // 날짜 파싱 (엑셀 시리얼 넘버 등 지원)
    let d = parseDateString(r.date);
    if (!d || isNaN(d)) return;
    
    // 마지막 거래일 및 해당 가격/금액 추적
    if (!supplierLastDateMap[s] || d > supplierLastDateMap[s]) {
      supplierLastDateMap[s] = d;
      
      // 가격 정보 - 단가(unit_price) 또는 price 필드 활용
      const price = Number(r.unit_price) || Number(r.price) || 0;
      supplierLastPriceMap[s] = price;
      
      // 해당 행의 spend 값을 마지막 거래 금액으로 저장
      const spend = Number(r.spend) || 0;
      supplierLastSpendMap[s] = spend;
    }
    
    // 발주 횟수 카운트
    supplierOrderCountMap[s] = (supplierOrderCountMap[s] || 0) + 1;
    
    // 발주 수량 누적 및 단위 기록
    const quantity = Number(r.quantity) || 0;
    if (!supplierQuantityMap[s]) supplierQuantityMap[s] = 0;
    supplierQuantityMap[s] += quantity;
    
    // 단위 추적 (마지막으로 처리된 단위를 사용)
    if (r.unit) supplierUnitMap[s] = r.unit;
  });

  // Calculate top suppliers based on spend
  const topSuppliers = Object.keys(supplierSpendMap)
    .sort((a, b) => supplierSpendMap[b] - supplierSpendMap[a])
    .filter(s => s); // Filter out empty supplier names

  return {
    supplierSpendMap,
    supplierLastDateMap,
    supplierOrderCountMap,
    supplierQuantityMap, 
    supplierUnitMap,
    supplierLastPriceMap,
    supplierLastSpendMap,
    topSuppliers
  };
}

// Extract top item from rows
export function findTopItem(rows) {
  if (!rows || rows.length === 0) return '';
  
  const itemSpendMap = {};
  rows.forEach(r => {
    const name = r.material_name || '';
    if (!itemSpendMap[name]) itemSpendMap[name] = 0;
    itemSpendMap[name] += Number(r.spend) || 0;
  });
  
  return Object.entries(itemSpendMap)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

// Calculate monthly spend data for a specific item
export function calculateItemMonthlySpend(rows, itemName) {
  const monthlySpend = {};
  
  if (!itemName || !rows || rows.length === 0) {
    return { monthlySpend, sortedMonths: [], maxSpend: 0 };
  }
  
  rows.filter(r => r.material_name === itemName).forEach(r => {
    // 날짜 파싱
    let d = parseDateString(r.date);
    if (!d || isNaN(d)) return;
    
    // 년-월 포맷으로 키 생성 (예: "2023-01")
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    // 해당 월의 지출 합계
    if (!monthlySpend[monthKey]) monthlySpend[monthKey] = 0;
    monthlySpend[monthKey] += Number(r.spend) || 0;
  });
  
  // 월별 데이터 정렬 (오래된 순)
  const sortedMonths = Object.keys(monthlySpend).sort();
  const maxSpend = Math.max(...sortedMonths.map(m => monthlySpend[m] || 0), 0);
  
  return { 
    monthlySpend, 
    sortedMonths, 
    maxSpend 
  };
}

// Group rows by material code
export function groupByMaterialCode(rows, groupTotalSpend) {
  // material_code별로 그룹핑 및 집계
  const materialMap = {};
  
  if (!rows || rows.length === 0) {
    return [];
  }
  
  rows.forEach(row => {
    const code = row.material_code || "";
    if (!materialMap[code]) {
      materialMap[code] = {
        material_code: code,
        material_name: row.material_name || "",
        spec: row.spec || "",
        color: row.color || "",
        form: row.form || "",
        quantity: 0,
        unit: row.unit || "",
        spend: 0,
      };
    }
    materialMap[code].quantity += Number(row.quantity) || 0;
    materialMap[code].spend += Number(row.spend) || 0;
  });

  // material별로 정렬 (spend 합계 순)
  const materialList = Object.values(materialMap).sort((a, b) => b.spend - a.spend);

  // 비중 계산 및 규격 합치기
  materialList.forEach(item => {
    item.percent = groupTotalSpend ? ((item.spend / groupTotalSpend) * 100).toFixed(1) : "0.0";
    item.spec_full = [item.spec, item.color, item.form].filter(Boolean).join(" / ");
  });
  
  return materialList;
}

// Calculate price history for top raw material
export function calculateRawMaterialPriceHistory(rows, topRawMaterial) {
  console.log("=========== 원자재 가격 차트 데이터 처리 ==========");
  console.log("Raw material:", topRawMaterial);
  
  if (!topRawMaterial || !rows || rows.length === 0) {
    console.log("No raw material data found for:", topRawMaterial);
    return { priceHistory: {}, sortedDates: [], maxPrice: 0 };
  }
  
  // 모든 raw_material 값들을 출력하여 대소문자나 공백 등 차이가 있는지 확인
  const uniqueRawMaterials = new Set();
  rows.forEach(r => {
    if (r.raw_material) uniqueRawMaterials.add(r.raw_material);
  });
  console.log("Available raw materials:", Array.from(uniqueRawMaterials));
  
  // Logging a few sample rows to check structure
  console.log("Sample raw materials from rows:");
  rows.slice(0, 3).forEach((r, i) => {
    console.log(`Row ${i+1}:`, {
      raw_material: r.raw_material,
      price: r.price,
      date: r.date
    });
  });
  
  // Filter rows for the top raw material and sort by date
  const relevantRows = rows
    .filter(r => r.raw_material === topRawMaterial && r.price)
    .sort((a, b) => {
      const dateA = parseDateString(a.date);
      const dateB = parseDateString(b.date);
      return dateA - dateB;
    });
  
  console.log("Found relevant rows:", relevantRows.length);
  
  if (relevantRows.length > 0) {
    console.log("First matching row:", {
      raw_material: relevantRows[0].raw_material,
      price: relevantRows[0].price,
      date: relevantRows[0].date
    });
  }
  
  // 10일 단위로 데이터 그룹화 준비
  const groupedData = {};
  
  relevantRows.forEach(r => {
    // 날짜 파싱
    let d = parseDateString(r.date);
    if (!d || isNaN(d)) return;
    
    // 년-월 추출
    const year = d.getFullYear();
    const month = d.getMonth() + 1; // 0-based to 1-based
    const day = d.getDate();
    
    // 10일 단위 기간 결정 (1-10, 11-20, 21-말일)
    let period = 1; // 기본값 (1-10일)
    
    if (day >= 11 && day <= 20) {
      period = 2; // 11-20일
    } else if (day >= 21) {
      period = 3; // 21-말일
    }
    
    // 그룹화 키 생성 (예: "2023-01-1" for Jan 1-10, "2023-01-2" for Jan 11-20)
    const groupKey = `${year}-${String(month).padStart(2, '0')}-${period}`;
    
    // 해당 그룹에 데이터 추가
    if (!groupedData[groupKey]) {
      groupedData[groupKey] = {
        totalPrice: 0,
        count: 0,
        displayDate: `${year}-${String(month).padStart(2, '0')}-${(period === 1 ? '10' : (period === 2 ? '20' : '30'))}`,
      };
    }
    
    groupedData[groupKey].totalPrice += Number(r.price) || 0;
    groupedData[groupKey].count += 1;
  });
  
  // 각 그룹의 평균 계산
  const priceHistory = {};
  
  Object.keys(groupedData).forEach(key => {
    const group = groupedData[key];
    if (group.count > 0) {
      // 표시용 날짜를 키로 사용
      priceHistory[group.displayDate] = group.totalPrice / group.count;
    }
  });
  
  // 날짜별 데이터 정렬 (오래된 순)
  const sortedDates = Object.keys(priceHistory).sort();
  const maxPrice = Math.max(...sortedDates.map(d => priceHistory[d] || 0), 0);
  
  console.log("10일 단위 그룹화 결과:", Object.keys(groupedData).length, "그룹");
  console.log("Processed date points:", sortedDates.length, "Max price:", maxPrice);
  
  if (sortedDates.length > 0) {
    console.log("Sample price data:", {
      date: sortedDates[0],
      price: priceHistory[sortedDates[0]]
    });
  }
  console.log("================================================");
  
  return { 
    priceHistory, 
    sortedDates, 
    maxPrice 
  };
}

// Get market forecast data from the Supplier tab based on sourcing_group_lvl2
export function getMarketForecastData(allData, rawMaterial) {
  console.log("=========== 시세 전망 데이터 처리 ==========");
  console.log("Raw material for market forecast:", rawMaterial);
  
  if (!rawMaterial || !allData || allData.length === 0) {
    console.log("No data for market forecast");
    return null;
  }
  
  // 모든 시트에서 해당 원자재의 market_analysis 데이터 찾기
  const relevantData = allData.filter(row => 
    row.raw_material === rawMaterial
  );
  
  console.log(`Found ${relevantData.length} entries related to raw material: ${rawMaterial}`);
  
  // 마켓 데이터 구성 초기화
  const marketForecast = {
    sourcingGroup: "",
    demandSupplyIssue: "",
    domesticSupplyLimit: "",
    regionalSituation: "",
    competitionIntensity: "",
    technicalDevelopment: "",
    summary: ""
  };
  
  // market_analysis 데이터를 먼저 찾음
  let foundMarketAnalysis = false;
  
  for (const row of relevantData) {
    if (row.market_analysis) {
      marketForecast.summary = row.market_analysis;
      if (row.sourcing_group_lvl2) {
        marketForecast.sourcingGroup = row.sourcing_group_lvl2;
      }
      console.log("Found market_analysis data:", marketForecast.summary.substring(0, 50) + "...");
      foundMarketAnalysis = true;
      break;
    }
  }
  
  // market_analysis 데이터가 없는 경우 다른 필드 확인
  if (!foundMarketAnalysis) {
    for (const row of relevantData) {
      if (row.market_supply_chain) {
        marketForecast.summary = row.market_supply_chain;
        if (row.sourcing_group_lvl2) {
          marketForecast.sourcingGroup = row.sourcing_group_lvl2;
        }
        console.log("Found market_supply_chain data:", marketForecast.summary.substring(0, 50) + "...");
        foundMarketAnalysis = true;
        break;
      }
    }
  }
  
  // 여전히 데이터가 없는 경우 sourcing_group_lvl2를 통해 검색
  if (!foundMarketAnalysis) {
    console.log("No direct market analysis data found, trying with sourcing_group_lvl2");
    
    // 1. Find the sourcing_group_lvl2 value for the raw material
    let sourcingGroupLvl2 = null;
    
    // Look through all the data to find the sourcing_group_lvl2 for the given raw material
    for (const row of allData) {
      if (row.raw_material === rawMaterial && row.sourcing_group_lvl2) {
        sourcingGroupLvl2 = row.sourcing_group_lvl2;
        break;
      }
    }
    
    if (!sourcingGroupLvl2) {
      console.log(`Could not find sourcing_group_lvl2 for raw material: ${rawMaterial}`);
      return null;
    }
    
    console.log(`Found sourcing_group_lvl2 for ${rawMaterial}: ${sourcingGroupLvl2}`);
    marketForecast.sourcingGroup = sourcingGroupLvl2;
    
    // 2. Find supplier information matching the sourcing_group_lvl2
    const supplierInfo = allData.filter(row => 
      row.sheet === 'Supplier' && 
      row.sourcing_group_lvl2 === sourcingGroupLvl2
    );
    
    if (supplierInfo.length > 0) {
      console.log(`Found ${supplierInfo.length} supplier entries for ${sourcingGroupLvl2}`);
      
      // Extract information from the supplier data
      supplierInfo.forEach(info => {
        if (info.demand_supply_issue) marketForecast.demandSupplyIssue = info.demand_supply_issue;
        if (info.domestic_supply_limit) marketForecast.domesticSupplyLimit = info.domestic_supply_limit;
        if (info.regional_situation) marketForecast.regionalSituation = info.regional_situation;
        if (info.competition_intensity) marketForecast.competitionIntensity = info.competition_intensity;
        if (info.technical_development) marketForecast.technicalDevelopment = info.technical_development;
        if (info.market_summary) marketForecast.summary = info.market_summary;
        if (info.market_analysis && !marketForecast.summary) marketForecast.summary = info.market_analysis;
      });
    } else {
      console.log(`No supplier information found for sourcing group: ${sourcingGroupLvl2}`);
      return null;
    }
  }
  
  console.log("Market forecast data ready:", !!marketForecast.summary);
  console.log("================================================");
  
  return marketForecast;
}

// Get strategy data based on raw_material
export function getStrategyData(allData, rawMaterial) {
  console.log("=========== 초기전략 데이터 처리 ==========");
  console.log("Raw material for strategy:", rawMaterial);
  
  if (!rawMaterial || !allData || allData.length === 0) {
    console.log("No data for strategy");
    return {
      marketAnalysis: "데이터를 불러올 수 없습니다.",
      priceAnalysis: "데이터를 불러올 수 없습니다.",
      strategy: "데이터를 불러올 수 없습니다."
    };
  }
  
  // 초기값 설정
  let marketAnalysis = "데이터를 불러올 수 없습니다.";
  let priceAnalysis = "데이터를 불러올 수 없습니다.";
  let strategy = "데이터를 불러올 수 없습니다.";
  
  // 모든 관련 시트에서 해당 원자재 데이터 찾기
  const relevantData = allData.filter(row => 
    row.raw_material === rawMaterial
  );
  
  console.log(`Found ${relevantData.length} entries for raw material: ${rawMaterial}`);
  
  if (relevantData.length > 0) {
    // 샘플 데이터 로깅
    console.log("Sample row fields:", Object.keys(relevantData[0]));
    console.log("Sample row data:", relevantData[0]);
    
    // 각 컬럼에 해당하는 값을 찾음 (정확한 컬럼명 사용)
    for (const row of relevantData) {
      // 컬럼명 체크: 다양한 이름 변형 지원
      if (row.market_analysis || row.market_supply_chain || row.market_supply) {
        marketAnalysis = row.market_analysis || row.market_supply_chain || row.market_supply;
        console.log("Found market analysis data");
        if (marketAnalysis !== "데이터를 불러올 수 없습니다.") break;
      }
    }
    
    for (const row of relevantData) {
      if (row.price_analysis || row.price_trend || row.price_forecast) {
        priceAnalysis = row.price_analysis || row.price_trend || row.price_forecast;
        console.log("Found price analysis data");
        if (priceAnalysis !== "데이터를 불러올 수 없습니다.") break;
      }
    }
    
    for (const row of relevantData) {
      if (row.strategy || row.initial_strategy || row.recommended_strategy) {
        strategy = row.strategy || row.initial_strategy || row.recommended_strategy;
        console.log("Found strategy data");
        if (strategy !== "데이터를 불러올 수 없습니다.") break;
      }
    }
    
    // 데이터 샘플 로깅
    console.log("Market Analysis Found:", marketAnalysis !== "데이터를 불러올 수 없습니다.");
    console.log("Price Analysis Found:", priceAnalysis !== "데이터를 불러올 수 없습니다.");
    console.log("Strategy Found:", strategy !== "데이터를 불러올 수 없습니다.");
  }
  
  // 직접 매칭되는 데이터가 없는 경우 sourcing_group_lvl2를 통해 시도
  if (marketAnalysis === "데이터를 불러올 수 없습니다." || 
      priceAnalysis === "데이터를 불러올 수 없습니다." || 
      strategy === "데이터를 불러올 수 없습니다.") {
    
    console.log("Missing some data, trying with sourcing_group_lvl2");
    
    // 해당 원자재의 sourcing_group_lvl2 찾기
    let sourcingGroupLvl2 = null;
    for (const row of allData) {
      if (row.raw_material === rawMaterial && row.sourcing_group_lvl2) {
        sourcingGroupLvl2 = row.sourcing_group_lvl2;
        break;
      }
    }
    
    if (sourcingGroupLvl2) {
      console.log(`Found sourcing_group_lvl2 for ${rawMaterial}: ${sourcingGroupLvl2}`);
      
      // 해당 sourcing_group_lvl2에 관련된 데이터 찾기 (모든 시트에서)
      const groupData = allData.filter(row => 
        row.sourcing_group_lvl2 === sourcingGroupLvl2
      );
      
      console.log(`Found ${groupData.length} entries for sourcing group: ${sourcingGroupLvl2}`);
      
      // 누락된 데이터 채우기
      if (marketAnalysis === "데이터를 불러올 수 없습니다.") {
        for (const row of groupData) {
          if (row.market_analysis || row.market_supply_chain || row.market_supply) {
            marketAnalysis = row.market_analysis || row.market_supply_chain || row.market_supply;
            console.log("Found market analysis from sourcing group");
            break;
          }
        }
      }
      
      if (priceAnalysis === "데이터를 불러올 수 없습니다.") {
        for (const row of groupData) {
          if (row.price_analysis || row.price_trend || row.price_forecast) {
            priceAnalysis = row.price_analysis || row.price_trend || row.price_forecast;
            console.log("Found price analysis from sourcing group");
            break;
          }
        }
      }
      
      if (strategy === "데이터를 불러올 수 없습니다.") {
        for (const row of groupData) {
          if (row.strategy || row.initial_strategy || row.recommended_strategy) {
            strategy = row.strategy || row.initial_strategy || row.recommended_strategy;
            console.log("Found strategy from sourcing group");
            break;
          }
        }
      }
    } else {
      console.log(`Could not find sourcing_group_lvl2 for raw material: ${rawMaterial}`);
    }
  }
  
  console.log("Strategy data processed");
  console.log("================================================");
  
  return {
    marketAnalysis,
    priceAnalysis,
    strategy
  };
} 
 
 
 
 
 
 