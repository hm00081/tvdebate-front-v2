import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClassHighlightState {
  highlightedClasses: string[]; // 타입을 명확히 지정
}

const initialState: ClassHighlightState = {
  highlightedClasses: [],
};

const classHighlightSlice = createSlice({
  name: "classHighlight", 
  initialState,
  reducers: {
    setHighlightedClass(state, action: PayloadAction<{ className: string }>) {
      const { className } = action.payload;
      
      // PROS나 CONS가 들어온 경우
      if (className === "PROS" || className === "CONS") {
        // 이미 선택된 경우 제거
        if (state.highlightedClasses.includes(className)) {
          state.highlightedClasses = state.highlightedClasses.filter(
            (item) => item !== className
          );
          if (state.highlightedClasses.length === 0) {
            clearHighlightedClass();
          }
        } else {
          // 선택되지 않은 경우 해당 값만 저장
          state.highlightedClasses = [className];
        }
      } else {
        // PROS/CONS 외의 값이 들어온 경우
        // PROS나 CONS가 저장되어 있다면 제거
        state.highlightedClasses = state.highlightedClasses.filter(
          item => item !== "PROS" && item !== "CONS"
        );
        
        // 기존 토글 로직 실행
        if (state.highlightedClasses.includes(className)) {
          state.highlightedClasses = state.highlightedClasses.filter(
            (item) => item !== className
          );
          if (state.highlightedClasses.length === 0) {
            clearHighlightedClass();
          }
        } else {
          state.highlightedClasses.push(className);
        }
      }
    },
    clearHighlightedClass(state) {
      state.highlightedClasses = []; // 전체 초기화
    },
  },
});

export const { setHighlightedClass, clearHighlightedClass } =
  classHighlightSlice.actions;
export default classHighlightSlice.reducer;
