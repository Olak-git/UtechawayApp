import { createSlice } from "@reduxjs/toolkit";

export const refreshSlice = createSlice({
    name: 'refresh',
    initialState: {
        historique_projects: 0,
        historique_factures: 0,
        historique_contrats: 0,
        cdc: 0,
        facture: 0,
        home_data: 0
    },
    reducers: {
        refreshHistoriqueProjects: (state) => {
            ++state.historique_projects;
        },
        refreshHistoriqueFactures: (state) => {
            ++state.historique_factures;
        },
        refreshHistoriqueContrats: (state) => {
            ++state.historique_contrats;
        },
        refreshCdc: (state) => {
            ++state.cdc;
        },
        refreshFacture: (state) => {
            ++state.facture;
        },
        refreshHomeData: (state) => {
            ++state.home_data;
        }
    }
})

export default refreshSlice.reducer;
export const { refreshHistoriqueProjects, refreshHistoriqueFactures, refreshHistoriqueContrats, refreshCdc, refreshFacture, refreshHomeData } = refreshSlice.actions