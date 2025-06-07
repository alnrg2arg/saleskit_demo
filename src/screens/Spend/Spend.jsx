import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDashboardStore } from "../DivWrapper/dashboardStore";

// Components
import { Frame } from "../../components/Frame";
import { Frame35307 } from "../../components/Frame35307";
import { Frame35308 } from "../../components/Frame35308";
import { FrameWrapper } from "../../components/FrameWrapper";
import { HomeIndicator } from "../../components/HomeIndicator";
import { IconEllipsis } from "../../components/IconEllipsis";

// Custom Components
import SpecTooltip from "../../components/SpendComponents/SpecTooltip";
import TruncateTooltip from "../../components/SpendComponents/TruncateTooltip";
import MonthlyBarChart from "../../components/SpendComponents/MonthlyBarChart";
import ItemMonthlyBarChart from "../../components/SpendComponents/ItemMonthlyBarChart";
import TabContent from "../../components/SpendComponents/TabContent";

// Icons
import { BarChart1 } from "../../icons/BarChart1";
import { CaretDown } from "../../icons/CaretDown";
import { ChevronBack1 } from "../../icons/ChevronBack1";
import { DocumentText1 } from "../../icons/DocumentText1";
import { Layers } from "../../icons/Layers/Layers";
import { Search1 } from "../../icons/Search1";
import { VariantOutline4 } from "../../icons/VariantOutline4/VariantOutline4";

// Utilities
import { formatSpend, formatTotalSpend, formatSpecDetail } from "../../utils/formatUtils";
import { formatDate } from "../../utils/dateUtils";
import { 
  calculateSupplierMetrics, 
  findTopItem, 
  calculateItemMonthlySpend,
  groupByMaterialCode,
  calculateRawMaterialPriceHistory
} from "../../utils/dataUtils";
import { generateSupplierCards } from "../../components/SpendComponents/SupplierCardGenerator";

// Styles
import "./style.css";

export const Spend = () => {
  const location = useLocation();
  const group = location.state?.group || "아이템AAA";
  const percent = location.state?.percent || "00.00";
  const dateRange = useDashboardStore(state => state.dateRange);
  const spendSum = location.state?.spendSum || 0;
  const mainMaterial = location.state?.mainMaterial || '';
  const mainSupplier = location.state?.mainSupplier || '';
  const mainSupplierSpend = location.state?.mainSupplierSpend || 0;
  const monthlySpendByGroup = useDashboardStore(state => state.monthlySpendByGroup);
  const monthlyData = monthlySpendByGroup?.[group] || {};
  const cardData = useDashboardStore(state => state.cardData);
  const totalSpend = useDashboardStore(state => state.totalSpend);
  const topItemSuppliersByGroup = useDashboardStore(state => state.topItemSuppliersByGroup || {});
  const [activeTab, setActiveTab] = useState('spend'); // 'spend', 'price', 'strategy'
  const [selectedRow, setSelectedRow] = useState(0); // Default selected row is first row (rank 1)

  // 현재 group의 rows 찾기
  const groupObj = cardData?.find(item => item.group === group);
  const rows = groupObj?.rows || [];

  // group 내에서 spend가 가장 높은 row 찾기
  let topRow = null;
  if (rows.length > 0) {
    topRow = rows.reduce((max, row) => (Number(row.spend || 0) > Number(max.spend || 0) ? row : max), rows[0]);
    console.log("Top Row Raw Material:", topRow?.raw_material);
  }

  // group 내 전체 spend 합계
  const groupTotalSpend = rows.reduce((sum, r) => sum + Number(r.spend || 0), 0);

  // 1. Material 데이터 처리
  const materialList = groupByMaterialCode(rows, groupTotalSpend);

  // 2. Supplier 및 Top Item 데이터 처리
  const topSuppliers = topItemSuppliersByGroup[group] || [];
  
  // Get topItemName based on selected row
  let topItemName = findTopItem(rows); // Default
  if (selectedRow > 0 && materialList[selectedRow]) {
    // If a row other than the first is selected, use that material name
    topItemName = materialList[selectedRow].material_name;
    console.log("Selected item name:", topItemName);
  }
  
  // 3. 1위 품목의 월간 구매 비용 계산
  const itemMonthlyData = calculateItemMonthlySpend(rows, topItemName);
  
  // 4. 선택된 품목에 대해 supplier 정보 계산
  const supplierMetrics = calculateSupplierMetrics(rows, topItemName);
  
  // 5. 공급업체 카드 데이터 생성
  const supplierCards = generateSupplierCards(topSuppliers, supplierMetrics);

  // 탭 정보 배열로 관리
  const tabList = [
    {
      key: 'spend',
      label: 'Spend 분석',
      icon: '/img/line-31-3.svg',
      textClass: 'text-wrapper-43',
      frameClass: 'frame-23',
    },
    {
      key: 'price',
      label: '원자재 시세',
      icon: '/img/line-31-4.svg',
      textClass: 'text-wrapper-44',
      frameClass: 'frame-24',
    },
    {
      key: 'strategy',
      label: '초기전략',
      icon: '/img/line-31-5.svg',
      textClass: 'text-wrapper-44',
      frameClass: 'frame-48',
    },
  ];
  
  // Row click handler
  const handleRowClick = (index) => {
    setSelectedRow(index);
    console.log("Row selected:", index);
  };

  // Get the currently selected row data based on selectedRow
  const getSelectedRowData = () => {
    if (selectedRow === 0 && materialList.length > 0) {
      // First row (rank 1) is selected
      return rows.find(row => 
        row.material_code === materialList[0]?.material_code && 
        row.material_name === materialList[0]?.material_name
      ) || topRow;
    } else if (selectedRow > 0 && materialList.length > selectedRow) {
      // Other rows are selected
      return rows.find(row => 
        row.material_code === materialList[selectedRow]?.material_code && 
        row.material_name === materialList[selectedRow]?.material_name
      ) || topRow;
    }
    // Default to topRow if no row is selected
    return topRow;
  };
  
  // Get the selected row data
  const selectedRowData = getSelectedRowData();
  
  // 원자재 시세 차트 데이터 계산
  console.log("원자재 데이터 계산 시작, 선택된 원자재:", selectedRowData ? {
    raw_material: selectedRowData.raw_material,
    spend: selectedRowData.spend
  } : "없음");
  const materialPriceData = calculateRawMaterialPriceHistory(rows, selectedRowData?.raw_material);
  
  // Add all rows to materialPriceData to use for market forecast data
  materialPriceData.allRows = rows;

  return (
    <div className="spend">
      <div className="overlap-wrapper-3">
        <div className="overlap-9">
          <div className="overlap-10">
            {/* Header */}
            <div className="frame-14">
              <div className="text-wrapper-33">구매 현황 및 분석</div>
              <ChevronBack1 className="chevron-back" color="#929292" />
            </div>
            <img className="line" alt="Line" src="/img/line-14-1.svg" />
            
            {/* Monthly Chart */}
            <div className="BG" style={{ position: 'relative' }}>
              <MonthlyBarChart monthlyData={monthlyData} />
            </div>
            
            {/* Home Indicator */}
            <div className="view">
              <div className="home-indicator-2" />
              <HomeIndicator
                className="home-indicator-instance"  
                homeIndicatorClassName="design-component-instance-node"  
              />
            </div>
            
            {/* Description */}
            <div className="frame-15">
              <div className="text-wrapper-34">구성 품목 현황</div>
              <p className="p">선택하신 품목의 상세 분석을 아래에서 확인하실 수 있습니다.</p>
            </div>
            
            {/* Search */}
            <div className="frame-16">
              <div className="frame-17">
                <div className="text-wrapper-35">품목Code, 품목명을 검색하세요</div>
                <div className="search-wrapper">
                  <Search1 className="icon-instance-node" />
                </div>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="overlap-11">
              {/* Main Material Card */}
              <div className="frame-18">
                <div className="frame-19">
                  <div className="overlap-12">
                    <div className="overlap-group-5 main-material-group">
                      <div className="overlap-group-5">
                        <div className="rectangle-13" />
                        <div className="text-wrapper-39">{mainMaterial}</div>
                      </div>
                    </div>
                    <div className="text-wrapper-38">최대 구성 품목</div>
                  </div>
                </div>
              </div>
              
              {/* Main Supplier Card */}
              <div className="frame-20">
                <div className="frame-19">
                  <div className="overlap-12">
                    <div className="overlap-group-5 supplier-group">
                      <div className="rectangle-13" />
                      <div className="text-wrapper-39">{mainSupplier}</div>
                      <div className="text-wrapper-40">(구매 비용: {formatSpend(mainSupplierSpend)})</div>
                    </div>
                    <div className="text-wrapper-38">최다 구매 공급업체</div>
                  </div>
                </div>
              </div>
              
              {/* Total Cost Card */}
              <div className="frame-21">
                <div className="frame-22">
                  <div className="element-wrapper">
                    <p className="element-4">
                      <span className="span">{formatTotalSpend(spendSum)} </span>
                    </p>
                  </div>
                  <div className="text-wrapper-42">총 구매 비용</div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="spend-tab-area">
              {/* Tab Buttons */}
              {tabList.map(tab => (
                <div
                  key={tab.key}
                  className={`${tab.frameClass} tab-btn${activeTab === tab.key ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <div className={tab.textClass}>{tab.label}</div>
                </div>
              ))}
              
              {/* Tab Content */}
              <TabContent 
                activeTab={activeTab} 
                supplierCards={supplierCards} 
                itemMonthlyData={itemMonthlyData}
                materialPriceData={materialPriceData}
                rawMaterial={selectedRowData?.raw_material}
                selectedRowData={selectedRowData}
                selectedRow={selectedRow}
                materialList={materialList}
              >
                <div className="frame-26">
                  <img className="img-2" alt="Solar chart bold" src="/img/solar-chart-bold-duotone-1.svg" />
                  <div className="text-wrapper-45">품목 구매 비용</div>
                </div>
                
                {/* 품목 구매 비용 아래 150px 공간 추가 */}
                <div style={{ height: '150px', width: '100%' }}></div>
              </TabContent>
            </div>
            
            {/* Register Button */}
            <div className="frame-27">
              <div className="text-wrapper-46">구매 데이터 등록</div>
            </div>
            <div className="material-symbols-wrapper">
              <img
                className="material-symbols"
                alt="Material symbols"
                src="/img/material-symbols-data-table-outline-rounded.svg"
              />
            </div>
            
            {/* Material Table */}
            <div className="frame-28">
              {/* Table Headers */}
              <div className="frame-29">
                {/* Replace img with div for better line control */}
                <div 
                  style={{
                    height: '1px',
                    left: 0,
                    position: 'absolute',
                    top: 26,
                    width: '1475px',
                    backgroundColor: '#699bf7',
                    opacity: 0.7
                  }}
                />
                <div className="frame-30">
                  <div className="frame-31">
                    <div className="text-wrapper-47">구매 순위</div>
                  </div>
                  <div className="frame-32">
                    <div className="text-wrapper-47">품목code</div>
                  </div>
                  <div className="frame-33">
                    <div className="text-wrapper-47">품목명</div>
                  </div>
                  <div className="frame-34">
                    <div className="text-wrapper-47">비중</div>
                  </div>
                  <div className="frame-35">
                    <div className="text-wrapper-47">총 구매 비용</div>
                  </div>
                  <div className="text-wrapper-48">수량</div>
                  <div className="text-wrapper-49">단위</div>
                  <div className="text-wrapper-50">규격</div>
                </div>
              </div>
              
              {/* Additional line to fix the broken one */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 31,
                width: '100%',
                height: '1px',
                backgroundColor: '#E0E0E0',
                zIndex: 1
              }}></div>
              
              {/* Container for ALL rows with scrolling */}
              <div style={{
                position: 'absolute',
                left: '24px',
                top: '39px', 
                width: '1410px',
                height: '125px', /* Fixed height to ensure 4 complete rows are visible */
                overflow: 'auto',
                paddingBottom: '4px'
              }}>
                {materialList.map((material, index) => (
                  <div 
                    key={index}
                    className="navbar"
                    onClick={() => handleRowClick(index)}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedRow === index ? '#d9e6fd' : '#699bf70d',
                      borderRadius: '8px',
                      border: selectedRow === index ? '1.5px solid #699bf7' : 'none',
                      boxShadow: selectedRow === index ? '0px 4px 4px #00000026' : '0px 4px 2px #0000000d',
                      marginBottom: '4px', /* Slightly larger margin between rows */
                      height: '27px', /* Fixed height for each row */
                      width: '100%',
                      position: 'relative',
                      minHeight: '27px'
                    }}
                  >
                    {/* Show different text elements based on whether this is the first row (Rank 1) or not */}
                    {index === 0 ? (
                      <>
                        {selectedRow === 0 && <div className="text-wrapper-62">구매 이력 보기</div>}
                        <div className="text-wrapper-63">
                          <TruncateTooltip value={material.material_name || '-'} max={15} />
                        </div>
                        <div className="text-wrapper-64">1</div>
                        <div className="text-wrapper-65">{material.percent || '0.0'} %</div>
                        <div className="text-wrapper-66">{formatSpend(material.spend || 0)}</div>
                        <div className="text-wrapper-67">{material.material_code || '-'}</div>
                        <div className="text-wrapper-68">
                          {material.quantity != null ? material.quantity.toLocaleString() : '-'}
                        </div>
                        <div className="text-wrapper-69">{material.unit || '-'}</div>
                        <p className="element-TEXT-2">
                          <SpecTooltip
                            displayText={formatSpecDetail(material || {})?.displayText || '-'}
                            fullText={formatSpecDetail(material || {})?.fullText || '-'}
                          />
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-wrapper-56">
                          <TruncateTooltip value={material.material_name || '-'} max={15} />
                        </div>
                        <div className="text-wrapper-57">{material.material_code || '-'}</div>
                        <div className="text-wrapper-51">{index + 1}</div>
                        <div className="text-wrapper-58">{material.percent || '0.0'} %</div>
                        <div className="text-wrapper-59">{formatSpend(material.spend || 0)}</div>
                        <div className="text-wrapper-60">
                          {material.quantity != null ? material.quantity.toLocaleString() : '-'}
                        </div>
                        <div className="text-wrapper-61">{material.unit || '-'}</div>
                        <p className="element-TEXT">
                          {formatSpecDetail(material || {})?.displayText || '-'}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Date Range */}
            <div className="frame-49">
              <DocumentText1 className="icon-instance-node" color="#699BF7" />
              <div className="text-wrapper-71">PSM 보고서 미리보기</div>
            </div>
            
            <div className="frame-37">
              <div className="text-wrapper-70">{dateRange || '조회기간 없음'}</div>
              <img className="calendar-today" alt="Calendar today" src="/img/calendar-today.svg" />
            </div>
            
            <div className="frame-38">
              <div className="text-wrapper-71">6개월</div>
            </div>
            <div className="frame-39">
              <div className="text-wrapper-72">12개월</div>
            </div>
            
            {/* Group Title */}
            <div className="frame-40">
              <div className="text-wrapper-73">{group}</div>
              <div className="text-wrapper-74">(전체 {percent}% 차지)</div>
            </div>
            
            {/* Process Flow */}
            <div className="frame-41">
              <div className="frame-42">
                <div className="frame-43">
                  <div className="frame-44">
                    <div className="text-wrapper-75">원자재</div>
                    <div className="text-wrapper-76">
                      <TruncateTooltip value={selectedRowData?.raw_material || '-'} />
                    </div>
                  </div>
                </div>
                <div className="frame-45">
                  <div className="frame-44">
                    <div className="text-wrapper-75">공정</div>
                    <div className="text-wrapper-77">
                      <TruncateTooltip value={selectedRowData?.process_procedure || "-"} />
                    </div>
                  </div>
                </div>
                <div className="frame-46">
                  <div className="frame-44">
                    <div className="text-wrapper-75">설비</div>
                    <div className="text-wrapper-78">
                      <TruncateTooltip value={selectedRowData?.equipment || '-'} max={25} />
                    </div>
                  </div>
                </div>
                <div className="frame-47">
                  <div className="frame-44">
                    <div className="text-wrapper-75">자재</div>
                    <div className="text-wrapper-79">
                      <TruncateTooltip value={selectedRowData?.material_name || '-'} max={25} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="frame-50">
        <img className="AI-gement" alt="Ai gement" src="/img/ai-gement-2.png" />
        <div className="overlap-14">
          <div className="group">
            <img className="user" alt="User" src="/img/user.png" />
            <div className="text-wrapper-80">김금동 대리</div>
            <div className="text-wrapper-81">admin@aiblue.com</div>
          </div>
          <IconEllipsis
            className="icon-ellipsis-instance"  
            divClassName="icon-ellipsis-2"  
            elementClassName="icon-ellipsis-2"  
            elementClassNameOverride="icon-ellipsis-2"  
          />
        </div>
        <div className="component">
          <div className="text-wrapper-82">구매 현황 및 분석</div>
          <BarChart1 className="bar-chart" />
        </div>
        <div className="component-2">
          <div className="text-wrapper-83">원가절감 모니터링</div>
          <svg 
            className="icon-instance-node-2" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20,18 C21.1,18 21.99,17.1 21.99,16 L22,6 C22,4.9 21.1,4 20,4 L4,4 C2.9,4 2,4.9 2,6 L2,16 C2,17.1 2.9,18 4,18 L0,18 L0,20 L24,20 L24,18 L20,18 Z M4,6 L20,6 L20,16 L4,16 L4,6 Z" fill="#000000"/>
          </svg>
        </div>
        <div className="overlap-group-6">
          <div className="component-3">
            <div className="text-wrapper-83">구매 마감 관리</div>
            <div className="addchart">
              <Layers className="layers-1" />
            </div>
          </div>
          <CaretDown className="caret-down" color="#B8C9EF" />
        </div>
        <div className="component-4">
          <div className="text-wrapper-83">공급 업체 관리</div>
          <img
            className="icon-instance-node-2"
            alt="React icons"
            src="/img/react-icons-pibuildingoffice.svg"
          />
          <CaretDown className="variant-filled-10" color="#B8C9EF" />
        </div>
        <div className="frame-51">
          <img
            className="icon-instance-node"
            alt="React icons"
            src="/img/react-icons-aioutlinesetting.svg"
          />
          <div className="text-wrapper-71">Al-mighty 설정</div>
        </div>
        <div className="component-5">
          <div className="text-wrapper-83">견적서 관리</div>
          <svg 
            className="icon-instance-node-2" 
            width="24px" 
            height="24px" 
            viewBox="0 0 24 24" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <path d="M20,4 L20,20 L18,18 L16,20 L14,18 L12,20 L10,18 L8,20 L6,18 L4,20 L4,4 L20,4 Z M18,8 L6,8 L6,10 L18,10 L18,8 Z M18,12 L6,12 L6,14 L18,14 L18,12 Z" fill="#000000"></path>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};