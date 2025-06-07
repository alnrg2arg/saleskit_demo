import { useState, useEffect, useRef } from 'react';

// 간단한 애니메이션 훅 - AnimationContext 완전 대체
export const useSimpleAnimation = (dependencies = []) => {
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const animationRef = useRef(false);
  
  // dependencies가 변경될 때마다 애니메이션 재실행
  useEffect(() => {
    setShouldAnimate(true);
    animationRef.current = false;
    
    // 애니메이션 완료 후 상태 리셋
    const timer = setTimeout(() => {
      animationRef.current = true;
    }, 1500); // 1.5초 후 완료
    
    return () => clearTimeout(timer);
  }, dependencies);
  
  return {
    shouldAnimate,
    isComplete: animationRef.current
  };
};

// 스태거 애니메이션용 지연 계산
export const getStaggerDelay = (index, baseDelay = 50) => {
  return index * baseDelay;
};

// 애니메이션 duration 상수
export const ANIMATION_DURATIONS = {
  FAST: 800,
  NORMAL: 1000,
  SLOW: 1200
}; 