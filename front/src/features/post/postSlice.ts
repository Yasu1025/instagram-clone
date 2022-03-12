import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import axios from 'axios'
import {
  PROPS_NEW_POST,
  PROPS_LIKED,
  PROPS_COMMENT,
  Post,
  Comment,
} from '../types'

const apiUrlPost = `${process.env.REACT_APP_DEV_API_URL}api/post/`
const apiUrlComment = `${process.env.REACT_APP_DEV_API_URL}api/comment/`

export interface PostState {
  isLoadingPost: boolean
  isOpenNewPost: boolean
  posts: Post[]
  comments: Comment[]
}

const initialState: PostState = {
  isLoadingPost: false,
  isOpenNewPost: false,
  posts: [
    {
      id: 0,
      title: '',
      userPost: 0,
      created_on: '',
      img: '',
      liked: 0,
    },
  ],
  comments: [
    {
      id: 0,
      text: '',
      userComment: 0,
      post: 0,
    },
  ],
}

// async func must be out from slice
export const fetchAsyncGetPosts = createAsyncThunk('post/get', async () => {
  const res = await axios.get(apiUrlPost, {
    headers: {
      Authorization: `JWT ${localStorage.localJWTToken}`,
    },
  })
  return res.data
})

export const fetchAsyncPostNewPost = createAsyncThunk(
  'post/post',
  async (newPost: PROPS_NEW_POST) => {
    const uploadData = new FormData()
    uploadData.append('title', newPost.title)
    newPost.img && uploadData.append('image', newPost.img, newPost.img.name)
    const res = await axios.post(apiUrlPost, uploadData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.localJWTToken}`,
      },
    })
    return res.data
  }
)

export const fetchAsyncGetComments = createAsyncThunk(
  'comment/get',
  async () => {
    const res = await axios.get(apiUrlComment, {
      headers: {
        Authorization: `JWT ${localStorage.localJWTToken}`,
      },
    })

    return res.data
  }
)

export const fetchAsyncPostComment = createAsyncThunk(
  'comment/post',
  async (comment: PROPS_COMMENT) => {
    const res = await axios.post(apiUrlComment, comment, {
      headers: {
        Authorization: `JWT ${localStorage.localJWTToken}`,
      },
    })
    return res.data
  }
)

// Liked on/off
export const fetchAsyncPatchLiked = createAsyncThunk(
  'post/patch',
  async (liked: PROPS_LIKED) => {
    const currentLiked = liked.current
    const uploadData = new FormData()

    let isAlreadyLiked = false
    currentLiked.forEach(current => {
      if (current === liked.new) {
        isAlreadyLiked = true
      } else {
        uploadData.append('liked', String(current))
      }
    })

    if (!isAlreadyLiked) {
      uploadData.append('liked', String(liked.new))
    } else if (currentLiked.length === 1) {
      uploadData.append('title', liked.title)
      // init liked (empty array)
      const res = await axios.put(`${apiUrlPost}${liked.id}`, uploadData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.localJWTToken}`,
        },
      })
      return res.data
    }

    // upload is here
    const res = await axios.patch(`${apiUrlPost}${liked.id}`, uploadData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.localJWTToken}`,
      },
    })
    return res.data
  }
)

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    fetchPostStart(state) {
      state.isLoadingPost = true
    },
    fetchPostend(state) {
      state.isLoadingPost = false
    },
    setOpenNewPost(state) {
      state.isOpenNewPost = true
    },
    setCloseNewPost(state) {
      state.isOpenNewPost = false
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, { payload }) => {
      return {
        ...state,
        posts: payload,
      }
    })
    builder.addCase(fetchAsyncPostNewPost.fulfilled, (state, { payload }) => {
      return {
        ...state,
        posts: [...state.posts, payload],
      }
    })
    builder.addCase(fetchAsyncGetComments.fulfilled, (state, { payload }) => {
      return {
        ...state,
        comments: payload,
      }
    })
    builder.addCase(fetchAsyncPostComment.fulfilled, (state, { payload }) => {
      return {
        ...state,
        comments: [...state.comments, payload],
      }
    })
    builder.addCase(fetchAsyncPatchLiked.fulfilled, (state, { payload }) => {
      return {
        ...state,
        posts: state.posts.map(p => (p.id === payload.id ? payload : p)),
      }
    })
  },
})

export const { fetchPostStart, fetchPostend, setOpenNewPost, setCloseNewPost } =
  postSlice.actions

export const selectIsLoadingPost = (state: RootState) =>
  state.post.isLoadingPost
export const selectOpenNewPost = (state: RootState) => state.post.isOpenNewPost
export const selectPosts = (state: RootState) => state.post.posts
export const selectComments = (state: RootState) => state.post.comments

export default postSlice.reducer
