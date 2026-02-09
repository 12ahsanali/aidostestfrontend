import { createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice ({
    name: 'auth',
    initialState: {
        name: null,
        isAuthenticated: false,
        loading: false,
    },
    reducers:{
        setUser:(state, action)=>{
            state.name = action.payload.name;
            state.isAuthenticated = true;
        },
        clearUser:(state)=>{
            state.name = null;
            state.isAuthenticated = false;
        },  
        setLoading:(state, action)=>{
            state.loading = action.payload;
        },
    }
})
export const {setUser, clearUser, setLoading} = authSlice.actions;
export default authSlice.reducer;