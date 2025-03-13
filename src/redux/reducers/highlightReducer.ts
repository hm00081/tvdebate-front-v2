// reducers/highlightReducer.js
import { createSlice } from '@reduxjs/toolkit';

const highlightSlice = createSlice({
    name: 'highlight',
    initialState: {
        highlightedGroup: null,
        highlightedName: null,
    },
    reducers: {
        setHighlightedGroup(state, action) {
            if (typeof action.payload === "string") {
                // @ts-ignore
                state.highlightedGroup = action.payload;
                state.highlightedName = null;
            } else if (Array.isArray(action.payload)) {
                // @ts-ignore
                state.highlightedGroup = action.payload;
                state.highlightedName = null;
            } else {
                const { group, name } = action.payload || {};
                state.highlightedGroup = group || null;
                state.highlightedName = name || null;
            }
        },
        clearHighlightedGroup(state) {
            state.highlightedGroup = null;
            state.highlightedName = null;
        },
    },
});

export const { setHighlightedGroup, clearHighlightedGroup } = highlightSlice.actions;
export default highlightSlice.reducer;
