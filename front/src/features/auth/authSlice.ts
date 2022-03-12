import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import axios from 'axios'
import { PROPS_AUTH, PROPS_NICKNAME, PROPS_PROFILE, Profile } from '../types'

const apiURL = process.env.REACT_APP_DEV_API_URL

export interface AuthState {
  openSignIn: boolean
  openSignUp: boolean
  openProfile: boolean
  isLoadingAuth: boolean
  myprofile: Profile
  profiles: Profile[]
}

const initialState: AuthState = {
  openSignIn: true,
  openSignUp: false,
  openProfile: false,
  isLoadingAuth: false,
  myprofile: {
    id: 0,
    nickName: '',
    userProfile: 0,
    created_on: '',
    img: '',
  },
  profiles: [],
}

// async func must be out from slice
export const fetchAsyncLogin = createAsyncThunk(
  'auth/post',
  async (auth: PROPS_AUTH) => {
    const res = await axios.post(`${apiURL}authen/jwt/create/`, auth, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // return token
    return res.data
  }
)

export const fetchAsyncRegister = createAsyncThunk(
  'auth/register',
  async (auth: PROPS_AUTH) => {
    const res = await axios.post(`${apiURL}api/register/`, auth, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  }
)

export const fetchAsyncCreateMyProfile = createAsyncThunk(
  'auth/profile/create',
  async (nickName: PROPS_NICKNAME) => {
    const res = await axios.post(`${apiURL}api/profile/`, nickName, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.localJWTToken}`,
      },
    })
    return res.data
  }
)

export const fetchAsyncUpdateProfile = createAsyncThunk(
  'auth/profile/update',
  async (profile: PROPS_PROFILE) => {
    const newProfile = new FormData()
    newProfile.append('nickName', profile.nickName)
    profile.img && newProfile.append('img', profile.img, profile.img.name)
    const res = await axios.put(
      `${apiURL}api/profile/${profile.id}/`,
      newProfile,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.localJWTToken}`,
        },
      }
    )
    return res.data
  }
)

export const fetchAsyncGetMyProfile = createAsyncThunk(
  'auth/myprofile/get',
  async () => {
    const res = await axios.get(`${apiURL}api/myprofile/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWTToken}`,
      },
    })
    return res.data[0]
  }
)

export const fetchAsyncGetAllProfiles = createAsyncThunk(
  'auth/profiles/get',
  async () => {
    const res = await axios.get(`${apiURL}api/profile/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWTToken}`,
      },
    })
    return res.data
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Loading
    fetchCredStart(state) {
      state.isLoadingAuth = true
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false
    },
    // Signin modal
    setOpenSignIn(state) {
      state.openSignIn = true
    },
    setCloseSignIn(state) {
      state.openSignIn = false
    },
    // Signup modal
    setOpenSignUp(state) {
      state.openSignUp = true
    },
    setCloseSignUp(state) {
      state.openSignUp = false
    },
    // Profile edit modal
    setOpenProfile(state) {
      state.openProfile = true
    },
    setCloseProfile(state) {
      state.openProfile = false
    },

    editNickName(state, { payload }) {
      state.myprofile.nickName = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAsyncLogin.fulfilled, (_, { payload }) => {
      localStorage.setItem('localJWTToken', payload.access)
    })
    builder.addCase(
      fetchAsyncCreateMyProfile.fulfilled,
      (state, { payload }) => {
        state.myprofile = payload
      }
    )
    builder.addCase(fetchAsyncGetMyProfile.fulfilled, (state, { payload }) => {
      state.myprofile = payload
    })
    builder.addCase(
      fetchAsyncGetAllProfiles.fulfilled,
      (state, { payload }) => {
        state.profiles = payload
      }
    )
    builder.addCase(fetchAsyncUpdateProfile.fulfilled, (state, { payload }) => {
      state.myprofile = payload
      state.profiles = state.profiles.map((p: Profile) =>
        p.id === payload.id ? payload : p
      )
    })
  },
})

export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenSignIn,
  setCloseSignIn,
  setOpenSignUp,
  setCloseSignUp,
  setOpenProfile,
  setCloseProfile,
  editNickName,
} = authSlice.actions

export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp
export const selectOpenProfile = (state: RootState) => state.auth.openProfile
export const selectMyProfile = (state: RootState) => state.auth.myprofile
export const selectProfiles = (state: RootState) => state.auth.profiles

export default authSlice.reducer
