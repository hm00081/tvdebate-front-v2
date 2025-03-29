import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveIndex {
    row: number | null;
    col: number | null;
}

interface HighlightState {
    rowTopTerms: string[];
    colTopTerms: string[];
    rowTopThirtyTerms: string[];
    colTopThirtyTerms: string[];
    activeIndex: ActiveIndex;
}

const initialState: HighlightState = {
    rowTopTerms: [],
    colTopTerms: [],
    rowTopThirtyTerms: [],
    colTopThirtyTerms: [],
    activeIndex: { row: null, col: null },
};

const highlightTextSlice = createSlice({
    name: 'highlightText',
    initialState,
    reducers: {
        setHighlightKeywords(
            state,
            action: PayloadAction<{
                rowTopTerms: string[];
                colTopTerms: string[];
                rowTopThirtyTerms: string[];
                colTopThirtyTerms: string[];
                activeIndex: ActiveIndex;
            }>
        ) {
            state.rowTopTerms = action.payload.rowTopTerms;
            state.colTopTerms = action.payload.colTopTerms;
            state.rowTopThirtyTerms = action.payload.rowTopThirtyTerms;
            state.colTopThirtyTerms = action.payload.colTopThirtyTerms;
            state.activeIndex = action.payload.activeIndex;
        },
        clearHighlightKeywords(state) {
            state.rowTopTerms = [];
            state.colTopTerms = [];
            state.rowTopThirtyTerms = [];
            state.colTopThirtyTerms = [];
            state.activeIndex = { row: null, col: null };
        },
    },
});

export const { setHighlightKeywords, clearHighlightKeywords } = highlightTextSlice.actions;
export default highlightTextSlice.reducer;
