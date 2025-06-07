import React from "react";
import * as XLSX from "xlsx";
import { Frame } from "../../components/Frame";
import { FrameWrapper } from "../../components/FrameWrapper";
import { IconEllipsis } from "../../components/IconEllipsis";
import { BarChart } from "../../icons/BarChart";
import { CaretDown } from "../../icons/CaretDown";
import { Checkbox } from "../../icons/Checkbox";
import { Layers } from "../../icons/Layers";
import { Search } from "../../icons/Search";
import { VariantOutline2 } from "../../icons/VariantOutline2";
import { VariantOutline4 } from "../../icons/VariantOutline4";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "./dashboardStore";

function formatSpend(sum) {
  return `${Math.round((sum / 1e8) * 10) / 10}억 원`;
}

function getSupplierText(suppliers) {
  if (!suppliers.length) return "";
  if (suppliers.length === 1) return suppliers[0];
  return `${suppliers[0]} 외 ${suppliers.length - 1}`;
}

function truncateWithTooltip(str, max = 25) {
  if (!str) return "";
  if (str.length <= max) return str;
  return (
    <span className="item-name-tooltip" title={str}>
      {str.slice(0, max)}...<span className="tooltip-box">{str}</span>
    </span>
  );
}

function parseDateString(dateStr) {
  // 엑셀 시리얼 넘버 지원
  if (typeof dateStr === "number") {
    // Excel serial date to JS Date
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + dateStr * 86400000);
  }
  if (typeof dateStr === "string") {
    dateStr = dateStr.trim();
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateStr)) {
      return new Date(dateStr.replace(/\./g, "-"));
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return new Date(dateStr);
    }
  }
  return null;
}

// 조회기간 한글 포맷 변환 함수
function getKoreanDateRange(dateRange) {
  if (!dateRange) return '';
  // "2024-10 ~ 2025-09" → "2024.10 ~ 2025.09"
  return dateRange.replace(/-/g, '.');
}

// 쉼표 등 포함된 spend 값도 숫자로 변환
function parseSpend(value) {
  if (typeof value === "string") {
    return Number(value.replace(/,/g, "")) || 0;
  }
  return Number(value) || 0;
}

/**
 * Calculate dynamic bar height so all bars fit within the available area, with a minimum height of 4px and a maximum of 16px.
 */
function getBarHeightDynamic(count, containerHeight = 220, minHeight = 4, maxHeight = 16) {
  if (!count) return minHeight;
  const h = Math.floor(containerHeight / count);
  if (h > maxHeight) return maxHeight;
  return h < minHeight ? minHeight : h;
}

/**
 * Truncate a string to max characters with ellipsis and tooltip.
 */
function truncateBarLabel(str, max = 30) {
  if (!str) return '';
  if (str.length <= max) return str;
  return (
    <span title={str} style={{ cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: '100%' }}>
      {str.slice(0, max)}...
    </span>
  );
}

function renderBarChart(barData) {
  if (!barData) return null;
  const total = barData.reduce((sum, item) => sum + (Number(item.spendSum) || 0), 0);
  if (total === 0) {
    return <div style={{ color: '#888', textAlign: 'center', margin: '20px 0' }}>구매비용 데이터가 없습니다.</div>;
  }
  // 0.5% 초과만 표시
  const bars = barData.filter(item => {
    const spend = Number(item.spendSum) || 0;
    const percent = (spend / total) * 100;
    return percent > 0.5;
  });
  const boxHeight = 220;
  const bottomMargin = 20;
  const availableHeight = boxHeight - bottomMargin;
  const minBarHeight = 3;
  const maxBarHeight = 8;
  const barGap = 0.5;
  let maxBars = bars.length;
  let barHeight = Math.floor((availableHeight - barGap * (maxBars - 1)) / maxBars);
  if (barHeight > maxBarHeight) barHeight = maxBarHeight;
  if (barHeight < minBarHeight) barHeight = minBarHeight;
  while ((barHeight * maxBars) + (barGap * (maxBars - 1)) > availableHeight && maxBars > 0) {
    maxBars--;
    barHeight = Math.floor((availableHeight - barGap * (maxBars - 1)) / maxBars);
    if (barHeight > maxBarHeight) barHeight = maxBarHeight;
    if (barHeight < minBarHeight) barHeight = minBarHeight;
  }
  const visibleBars = bars.slice(0, maxBars);
  let maxPercent = 0;
  visibleBars.forEach(item => {
    const spend = Number(item.spendSum) || 0;
    const percent = (spend / total) * 100;
    if (percent > maxPercent) maxPercent = percent;
  });
  return (
    <div className="bar-chart-list" style={{height: availableHeight, minHeight: availableHeight, maxHeight: availableHeight, overflow: 'hidden', marginBottom: bottomMargin}}>
      {visibleBars.map((item, idx) => {
        const spend = Number(item.spendSum) || 0;
        const percent = (spend / total) * 100;
        let barWidthValue = percent * 2.5;
        if (barWidthValue > 99) barWidthValue = 99;
        const barWidth = `${barWidthValue}%`;
        return (
          <div className="bar-row" key={item.group} style={{height: barHeight, alignItems: 'center', marginBottom: idx !== visibleBars.length - 1 ? barGap : 0}}>
            <span className="bar-label" style={{minWidth: 150, maxWidth: 300, fontSize: '9px', marginRight: 1}}>{truncateBarLabel(item.group, 30)}</span>
            <div className="bar-bg" style={{height: Math.max(barHeight-2, 3)}}>
              <div
                className="bar-fill"
                style={{ width: barWidth, height: Math.max(barHeight-2, 3), minHeight: 3, maxHeight: 8 }}
                title={`${item.group}: ${percent.toFixed(1)}% (${spend})`}
              />
              <span className="bar-value" style={{fontSize: '8px'}}>{percent.toFixed(1)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const DivWrapper = () => {
  const navigate = useNavigate();
  const {
    cardData,
    uniqueGroupCount,
    uniqueMaterialCodeCount,
    totalSpend,
    dateRange,
    setDashboard,
    loadFromStorage,
    saveToStorage,
  } = useDashboardStore();

  // chartMode 상태 추가
  const [chartMode, setChartMode] = React.useState('item');

  // 복원: 마운트 시 Zustand에서 localStorage로 불러오기
  React.useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // 엑셀 업로드 및 파싱
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      // 그룹핑
      const groupMap = {};
      const materialCodeSet = new Set();
      let spendSumAll = 0;
      let minDate = null;
      let maxDate = null;
      json.forEach((row) => {
        const group = row.sourcing_group_lvl1;
        if (!group) return;
        if (!groupMap[group]) groupMap[group] = [];
        groupMap[group].push(row);
        if (row.material_code) materialCodeSet.add(row.material_code);
        spendSumAll += parseSpend(row.spend);
        if (row.date) {
          const d = parseDateString(row.date);
          if (d instanceof Date && !isNaN(d)) {
            if (!minDate || d < minDate) minDate = d;
            if (!maxDate || d > maxDate) maxDate = d;
          }
        }
      });
      // 조회 기간
      let dateRangeValue = "";
      if (minDate && maxDate) {
        const format = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        dateRangeValue = `${format(minDate)} ~ ${format(maxDate)}`;
      }
      // 그룹별 집계
      let groups = Object.entries(groupMap).map(([group, rows]) => {
        const spendSum = rows.reduce((sum, r) => sum + parseSpend(r.spend), 0);
        const supplierSpend = {};
        rows.forEach((r) => {
          if (!r.supplier) return;
          if (!supplierSpend[r.supplier]) supplierSpend[r.supplier] = 0;
          supplierSpend[r.supplier] += parseSpend(r.spend);
        });
        const supplierList = Object.entries(supplierSpend)
          .sort((a, b) => b[1] - a[1])
          .map(([name]) => name);
        const materialSpend = {};
        rows.forEach((r) => {
          if (!r.raw_material) return;
          if (!materialSpend[r.raw_material]) materialSpend[r.raw_material] = 0;
          materialSpend[r.raw_material] += parseSpend(r.spend);
        });
        const mainMaterial = Object.entries(materialSpend)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || "";
        return {
          group,
          spendSum,
          supplierList,
          mainSupplier: supplierList[0] || "",
          supplierCount: supplierList.length,
          mainMaterial,
          rows,
        };
      });
      groups = groups.sort((a, b) => b.spendSum - a.spendSum);

      // 그룹별 품목명 1위의 supplier별 구매액 내림차순 배열 구하기
      const topItemSuppliersByGroup = {};
      Object.entries(groupMap).forEach(([group, rows]) => {
        // 품목명별로 spend 합산
        const itemSpendMap = {};
        rows.forEach(r => {
          const name = r.material_name || '';
          if (!itemSpendMap[name]) itemSpendMap[name] = 0;
          itemSpendMap[name] += parseSpend(r.spend);
        });
        // spend 1위 품목명
        const topItem = Object.entries(itemSpendMap).sort((a,b)=>b[1]-a[1])[0]?.[0];
        if (!topItem) return;
        // 해당 품목을 공급한 supplier별 spend 합산
        const supplierSpend = {};
        rows.filter(r=>r.material_name===topItem).forEach(r=>{
          const s = r.supplier || '';
          if (!s) return;
          if (!supplierSpend[s]) supplierSpend[s]=0;
          supplierSpend[s]+=parseSpend(r.spend);
        });
        // 내림차순 정렬
        const sortedSuppliers = Object.entries(supplierSpend).sort((a,b)=>b[1]-a[1]).map(([name])=>name);
        topItemSuppliersByGroup[group] = sortedSuppliers;
      });

      // 월별 spend 집계 (sourcing_group_lvl1별, 월별)
      // { [group]: { [YYYY-MM]: sum } }
      const monthlySpendByGroup = {};
      json.forEach(row => {
        const group = row.sourcing_group_lvl1;
        if (!group) return;
        const d = parseDateString(row.date);
        if (!(d instanceof Date) || isNaN(d)) return;
        const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        if (!monthlySpendByGroup[group]) monthlySpendByGroup[group] = {};
        if (!monthlySpendByGroup[group][ym]) monthlySpendByGroup[group][ym] = 0;
        monthlySpendByGroup[group][ym] += parseSpend(row.spend);
      });

      setDashboard({
        cardData: groups,
        uniqueGroupCount: Object.keys(groupMap).length,
        uniqueMaterialCodeCount: materialCodeSet.size,
        totalSpend: spendSumAll,
        dateRange: dateRangeValue,
        monthlySpendByGroup,
        topItemSuppliersByGroup,
      });
      saveToStorage();
    };
    reader.readAsArrayBuffer(file);
  };

  // Helper to get bar chart data by raw_material
  function getMaterialBarData(cardData) {
    if (!cardData) return [];
    const grouped = {};
    cardData.forEach(item => {
      // item.rows: all rows for this group
      if (item.rows) {
        item.rows.forEach(row => {
          const key = row.raw_material || '기타';
          const spend = Number(row.spend) || 0;
          if (!grouped[key]) grouped[key] = 0;
          grouped[key] += spend;
        });
      }
    });
    // 필드명 맞추기 (group, spendSum)
    const rawMaterialArr = Object.entries(grouped).map(([name, spend]) => ({
      group: name,
      spendSum: spend,
    }));
    rawMaterialArr.sort((a, b) => b.spendSum - a.spendSum);
    const top15 = rawMaterialArr.slice(0, 15);
    return top15;
  }

  // 카드 렌더링 함수 (Frame, FrameWrapper)
  const renderCards = () => {
    if (!cardData || cardData.length === 0) return null; // 데이터가 없을 경우 아무것도 표시하지 않음
    
    // 카드 데이터가 있으면 동적으로 렌더링 (최대 12개)
    return cardData.slice(0, 12).map((item, idx) => {
      const itemNameNode = truncateWithTooltip(item.group, 25);
      const mainMaterialNode = truncateWithTooltip(item.mainMaterial, 20);
      const percent = totalSpend ? ((item.spendSum / totalSpend) * 100).toFixed(2) : "0.00";
      const handleCardClick = () => {
        // mainSupplierSpend 계산
        let mainSupplierSpend = 0;
        if (item.rows && item.mainSupplier) {
          mainSupplierSpend = item.rows
            .filter(r => r.supplier === item.mainSupplier)
            .reduce((sum, r) => sum + parseSpend(r.spend), 0);
        }
        navigate("/spend", { state: { group: item.group, percent, spendSum: item.spendSum, mainMaterial: item.mainMaterial, mainSupplier: item.mainSupplier, mainSupplierSpend } });
      };
      if (idx < 3) {
        return (
          <Frame
            key={idx}
            className={idx === 0 ? "frame-302" : idx === 1 ? "frame-27" : "frame-28"}
            divClassName={idx === 0 ? "frame-instance" : idx === 1 ? "frame-302-instance" : "frame-29"}
            divClassName1={undefined}
            divClassName2={idx === 1 ? "frame-26" : idx === 2 ? "frame-26" : undefined}
            divClassNameOverride={idx === 1 || idx === 2 ? "design-component-instance-node" : undefined}
            hugeiconsAiContent="/img/hugeicons-ai-content-generator-01-2.svg"
            text={String(idx + 1)}
            text1={getSupplierText([item.mainSupplier, ...item.supplierList.slice(1)])}
            text2={mainMaterialNode}
            text3={itemNameNode}
            spend={formatSpend(item.spendSum)}
            onClick={handleCardClick}
            style={{ cursor: "pointer" }}
          />
        );
      } else {
        return (
          <FrameWrapper
            key={idx}
            className={
              idx === 3 ? "frame-301" :
              idx === 4 ? "frame-301-instance" :
              idx === 5 ? "frame-30" :
              idx === 6 ? "frame-31" :
              idx === 7 ? "frame-32" :
              idx === 8 ? "frame-33" :
              idx === 9 ? "frame-34" :
              idx === 10 ? "frame-36" :
              "frame-38"
            }
            divClassName={
              idx === 3 || idx === 4 || idx === 5 || idx === 7 || idx === 8 ? "design-component-instance-node" :
              idx === 9 ? "frame-35" :
              idx === 10 ? "frame-37" :
              "frame-35"
            }
            hugeiconsAiContent={idx < 9 ? "/img/hugeicons-ai-content-generator-01-2.svg" : "/img/hugeicons-ai-content-generator-01-11.svg"}
            text={String(idx + 1)}
            itemName={itemNameNode}
            spend={formatSpend(item.spendSum)}
            supplier={getSupplierText([item.mainSupplier, ...item.supplierList.slice(1)])}
            material={mainMaterialNode}
            onClick={handleCardClick}
            style={{ cursor: "pointer" }}
          />
        );
      }
    });
  };

  // Determine which data to show in the bar chart
  let barChartData = cardData;
  let barChartLabel = '소싱그룹별 구매 비중';
  if (chartMode === 'material') {
    barChartData = getMaterialBarData(cardData);
    barChartLabel = '원자재별 구매 비중';
  }

  return (
    <div className="div-wrapper">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-2">
            <div className="text-wrapper-9">구매 현황 및 분석</div>

            <div className="frame-6">
              <div className="text-wrapper-10">아이템별</div>

              <img
                className="img-2"
                alt="Icon park outline"
                src="/img/icon-park-outline-switch.svg"
              />
            </div>

            <img className="line-3" alt="Line" src="/img/line-14-2.svg" />

            <div className="frame-7">
              <img className="line-4" alt="Line" src="/img/line-32.svg" />

              <img className="line-5" alt="Line" src="/img/line-32.svg" />

              <div className="overlap-3">
                <div className="overlap-group-wrapper">
                  <div className="overlap-group-2" style={{ position: 'relative' }}>
                    <div className="rectangle" />
                    <div className="text-wrapper-11">총 구매 비용</div>
                    <span className="total-item-count">
                      {formatSpend(totalSpend)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overlap-4">
                <div className="frame-8">
                  <div className="overlap-group-2" style={{ position: 'relative' }}>
                    <div className="rectangle-2" />
                    <div className="text-wrapper-11">총 아이템</div>
                    <span
                      className="total-item-count"
                    >
                      {uniqueGroupCount} <span className="text-wrapper-12">개</span>
                    </span>
                  </div>
                </div>

                <div className="frame-9">
                  <div className="overlap-group-2" style={{ position: 'relative' }}>
                    <div className="rectangle-2" />
                    <div className="text-wrapper-11">총 품목</div>
                    <span className="total-item-count">
                      {uniqueMaterialCodeCount} <span className="text-wrapper-12">개</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="frame-10">
                <Checkbox className="checkbox-instance" />
                <div className="text-wrapper-13">
                  오천만원 이하 아이템 미표시
                </div>
              </div>

              <div className="text-wrapper-14">조회 기준</div>

              <div className="frame-11">
                <div className="text-wrapper-15">입고 마감월</div>
              </div>

              <div className="frame-12">
                <div className="text-wrapper-16">현재 월</div>
              </div>

              <div className="text-wrapper-17">조회 기간</div>

              <div className="overlap-5">
                <div className="text-wrapper-18">{dateRange}</div>
                <img
                  className="calendar-today"
                  alt="Calendar today"
                  src="/img/calendar-today.svg"
                />
              </div>

              <div className="frame-13">
                <div className="text-wrapper-16">6개월</div>
              </div>

              <div className="frame-14">
                <div className="text-wrapper-19">12개월</div>
              </div>
            </div>

            <div className="frame-15">
              <div className="overlap-6">
                <div className="frame-16">
                  <img
                    className="ri-chat-ai-fill"
                    alt="Ri chat ai fill"
                    src="/img/ri-chat-ai-fill.svg"
                  />

                  <p className="AAA-3">
                    <span className="text-wrapper-20">아이템AAA의 </span>

                    <span className="text-wrapper-21">시장 종합 전망</span>

                    <span className="text-wrapper-20">을 알려드립니다.</span>
                  </p>
                </div>

                <div className="TEXT-TEXT-TEXT-TEXT-wrapper">
                  <p className="TEXT-TEXT-TEXT-TEXT">
                    {" "}
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT.
                    <br />
                    <br />
                    &nbsp;&nbsp;TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT
                    <br />
                    <br />
                    &nbsp;&nbsp;TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    <br />
                    <br /> TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT <br />
                    <br /> TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                    TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT TEXT
                  </p>
                </div>

                <div className="frame-17">
                  <div className="frame-18">
                    <div className="text-wrapper-22">수요/공급 이슈</div>
                  </div>

                  <div className="frame-19">
                    <p className="text-wrapper-22">
                      국내 공급 및 수입 구조의 한계
                    </p>
                  </div>

                  <div className="frame-20">
                    <p className="text-wrapper-22">지역별 상황 및 기타 변수</p>
                  </div>

                  <div className="frame-21">
                    <p className="text-wrapper-22">
                      경쟁 강도: 주요 수출국 및 가격 경쟁력
                    </p>
                  </div>

                  <div className="frame-22">
                    <div className="text-wrapper-22">
                      기술개발 현황 (선택적 분석)
                    </div>
                  </div>
                </div>
              </div>

              <img
                className="ph-caret-double-up"
                alt="Ph caret double up"
                src="/img/ph-caret-double-up-bold.svg"
              />
            </div>

            <div className="text-wrapper-23">소싱그룹별 구매 순위</div>

            <p className="text-wrapper-24">
              {dateRange || '조회기간 없음'}
            </p>

            {/* 안내 메시지 - 아이템별 구매 순위 바로 아래에 배치 */}
            {!cardData || cardData.length === 0 ? (
              <div 
                style={{ 
                  maxWidth: '600px',
                  margin: '620px 0 30px 100px', 
                  padding: '0',
                  height: '250px',
                  textAlign: 'center', 
                  backgroundColor: '#f9f9f9', 
                  borderRadius: '12px',
                  border: '2px dashed #699bf7',
                  color: '#699bf7',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#1E5ECC';
                  e.currentTarget.style.backgroundColor = '#f0f5ff';
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#699bf7';
                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#699bf7';
                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                  
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const fileInput = document.getElementById('excel-upload');
                    fileInput.files = e.dataTransfer.files;
                    
                    // 파일 업로드 핸들러 호출
                    handleFileUpload({ target: { files: e.dataTransfer.files } });
                  }
                }}
                onClick={() => {
                  document.getElementById('excel-upload').click();
                }}
              >
                <p style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '500' }}>구매 데이터가 없습니다</p>
                <p style={{ margin: '0', fontSize: '16px' }}>
                  이곳에 파일을 끌어다 놓으세요
                </p>
              </div>
            ) : null}

            {/* 차트 영역 - 데이터 유무와 관계없이 표시 */}
            <div className="overlap-7">
              <div className="frame-23" style={{ 
                boxSizing: 'border-box',
                width: 'auto',
                minWidth: '135px',
                padding: '2px',
                marginLeft: '-8px'
              }}>
                <div
                  className="frame-24"
                  onClick={() => setChartMode('item')}
                  style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    backgroundColor: chartMode === 'item' ? '#f0f5ff' : 'transparent'
                  }}
                >
                  <img
                    className="img-3"
                    alt="Basil chart pie"
                    src="/img/basil-chart-pie-solid.svg"
                    style={{ 
                      filter: chartMode === 'item' 
                        ? 'brightness(0) saturate(100%) invert(23%) sepia(90%) saturate(1960%) hue-rotate(213deg) brightness(92%) contrast(98%)' 
                        : 'grayscale(1) opacity(0.7)',
                      transition: 'filter 0.2s ease',
                      marginRight: '6px'
                    }}
                  />
                  <div
                    className="text-wrapper-25"
                    style={{ color: chartMode === 'item' ? '#154ecc' : '#929292', fontWeight: chartMode === 'item' ? 700 : 400 }}
                  >
                    소싱그룹별 구매비중
                  </div>
                </div>
                <div
                  className="frame-25"
                  onClick={() => setChartMode('material')}
                  style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    backgroundColor: chartMode === 'material' ? '#f0f5ff' : 'transparent'
                  }}
                >
                  <img
                    className="img-3"
                    alt="Pixelarticons chart"
                    src="/img/pixelarticons-chart-bar.svg"
                    style={{ 
                      filter: chartMode === 'material' 
                        ? 'brightness(0) saturate(100%) invert(23%) sepia(90%) saturate(1960%) hue-rotate(213deg) brightness(92%) contrast(98%)' 
                        : 'grayscale(1) opacity(0.7)',
                      transition: 'filter 0.2s ease',
                      marginRight: '6px'
                    }}
                  />
                  <div
                    className="text-wrapper-26"
                    style={{ color: chartMode === 'material' ? '#154ecc' : '#929292', fontWeight: chartMode === 'material' ? 700 : 400 }}
                  >
                    원자재별 구매비중
                  </div>
                </div>
              </div>
              <div
                className="text-wrapper-27"
                onClick={() => setChartMode(chartMode === 'item' ? 'material' : 'item')}
                style={{ cursor: 'pointer' }}
              >
                {barChartLabel}
              </div>
              {cardData && cardData.length > 0 ? renderBarChart(barChartData) : (
                <div style={{ 
                  height: '220px',
                }}></div>
              )}
            </div>

            {/* 카드 목록 표시 */}
            {cardData && cardData.length > 0 ? renderCards() : null}

            <div className="frame-39">
              <img
                className="img-2"
                alt="Vscode icons file"
                src="/img/vscode-icons-file-type-excel2.svg"
              />

              <div className="text-wrapper-10">엑셀 저장</div>
            </div>

            <div className="frame-40">
              <label htmlFor="excel-upload" className="text-wrapper-28" style={{ cursor: 'pointer' }}>구매 데이터 등록</label>
              <input
                type="file"
                id="excel-upload"
                style={{ display: "none" }}
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
              />
            </div>

            <div className="material-symbols-wrapper">
              <label htmlFor="excel-upload" style={{ cursor: 'pointer' }}>
              <img
                className="material-symbols"
                alt="Material symbols"
                src="/img/material-symbols-data-table-outline-rounded.svg"
              />
              </label>
            </div>

            <div className="overlap-8">
              <div className="search-wrapper">
                <Search className="react-icons" color="#154ECC" />
              </div>

              <div className="text-wrapper-29">
                품목Code, 품목명을 검색하세요
              </div>
            </div>
          </div>

          <div className="overlap-9">
            <IconEllipsis
              className="icon-ellipsis-instance"
              divClassName="icon-ellipsis-2"
              elementClassName="icon-ellipsis-2"
              elementClassNameOverride="icon-ellipsis-2"
            />
            <div className="frame-41">
              <img
                className="AI-gement"
                alt="Ai gement"
                src="/img/ai-gement-2.png"
              />

              <div className="overlap-10">
                <div className="group-3">
                  <img className="user" alt="User" src="/img/user.png" />

                  <div className="text-wrapper-30">김금동 대리</div>

                  <div className="text-wrapper-31">admin@aiblue.com</div>
                </div>

                <IconEllipsis
                  className="icon-ellipsis-3"
                  divClassName="icon-ellipsis-2"
                  elementClassName="icon-ellipsis-2"
                  elementClassNameOverride="icon-ellipsis-2"
                />
              </div>

              <div className="component">
                <div className="text-wrapper-32">구매 현황 및 분석</div>

                <BarChart className="bar-chart" />
              </div>

              <div className="component-2">
                <div className="text-wrapper-33">원가절감 모니터링</div>
                <svg 
                  className="icon-instance-node" 
                  width="24px" 
                  height="24px" 
                  viewBox="0 0 24 24" 
                  version="1.1" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <path d="M20,18 C21.1,18 21.99,17.1 21.99,16 L22,6 C22,4.9 21.1,4 20,4 L4,4 C2.9,4 2,4.9 2,6 L2,16 C2,17.1 2.9,18 4,18 L0,18 L0,20 L24,20 L24,18 L20,18 Z M4,6 L20,6 L20,16 L4,16 L4,6 Z" fill="#000000"></path>
                  </g>
                </svg>
              </div>

              <div className="overlap-11">
                <div className="component-3">
                  <div className="text-wrapper-33">구매 마감 관리</div>
                  <div className="addchart">
                    <Layers className="layers-instance" />
                  </div>
                </div>
                <CaretDown className="caret-down" color="#B8C9EF" />
              </div>

              <div className="component-4">
                <div className="text-wrapper-33">공급 업체 관리</div>

                <img
                  className="icon-instance-node"
                  alt="React icons"
                  src="/img/react-icons-pibuildingoffice.svg"
                />

                <CaretDown className="variant-filled-1" color="#B8C9EF" />
              </div>

              <div className="frame-42">
                <img
                  className="react-icons"
                  alt="React icons"
                  src="/img/react-icons-aioutlinesetting.svg"
                />

                <div className="text-wrapper-16">Al-mighty 설정</div>
              </div>

              <div className="component-5">
                <div className="text-wrapper-33">견적서 관리</div>
                <svg 
                  className="icon-instance-node" 
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
        </div>
      </div>
    </div>
  );
};
