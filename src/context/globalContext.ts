import React from 'react';

export type Step = {
    lat: number;
    lon: number;
    timestamp: number;
};

export type globalState = {
    tracks: Step[]
};

export const initialState = {
    tracks: []
};

export const reducer = (state: globalState, action: any): globalState => {
    switch (action.type) {
        case "SAVE_TRACKS": {
            return { ...state, tracks: action.payload };
        }
        default:
            return state;
    }
};

const GlobalContext = React.createContext<{
    state: globalState;
    dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

export { GlobalContext as default };