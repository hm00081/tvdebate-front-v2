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
      if (state.highlightedClasses.includes(className)) {
        // 이미 선택된 경우 제거
        state.highlightedClasses = state.highlightedClasses.filter(
          (item) => item !== className
        );
      } else {
        // 선택되지 않은 경우 추가
        state.highlightedClasses.push(className);
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
