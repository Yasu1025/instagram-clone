import React, { memo, VFC, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  Button,
  Grid,
  Avatar,
  Badge,
  CircularProgress,
} from '@material-ui/core'
import { MdAddAPhoto } from 'react-icons/md'
import {
  editNickName,
  selectMyProfile,
  selectIsLoadingAuth,
  setOpenSignIn,
  setCloseSignIn,
  setOpenSignUp,
  setCloseSignUp,
  setOpenProfile,
  setCloseProfile,
  fetchAsyncGetMyProfile,
  fetchAsyncGetAllProfiles,
} from '../auth/authSlice'

import {
  selectPosts,
  selectIsLoadingPost,
  setOpenNewPost,
  setCloseNewPost,
  fetchAsyncGetPosts,
  fetchAsyncGetComments,
} from '../post/postSlice'

import { AppDispatch } from '../../app/store'
import { Auth } from '../auth/Auth'
import styles from './Core.module.css'
import { Post } from '../post/Post'

const StyledBadge = withStyles(theme => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge)

export const Core: VFC = memo(() => {
  const dispatch: AppDispatch = useDispatch()
  const myProfile = useSelector(selectMyProfile)
  const posts = useSelector(selectPosts)
  const isLoadingPost = useSelector(selectIsLoadingPost)
  const isLoadingAuth = useSelector(selectIsLoadingAuth)

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWTToken) {
        dispatch(setCloseSignIn())
        const result = await dispatch(fetchAsyncGetAllProfiles())
        if (fetchAsyncGetAllProfiles.rejected.match(result)) {
          dispatch(setOpenSignIn())
          return null
        }
        await dispatch(fetchAsyncGetPosts())
        await dispatch(fetchAsyncGetAllProfiles())
        await dispatch(fetchAsyncGetComments())
      }
    }
    fetchBootLoader()
  }, [dispatch])

  const onOpenNewPost = () => {
    dispatch(setOpenNewPost())
    dispatch(setCloseProfile())
  }

  const onLogout = () => {
    localStorage.removeItem('localJWTToken')
    dispatch(editNickName(''))
    dispatch(setCloseProfile())
    dispatch(setCloseNewPost())
    dispatch(setOpenSignIn())
  }

  const onOpenProf = () => {
    dispatch(setOpenProfile())
    dispatch(setCloseNewPost())
  }

  const onOpenLogIn = () => {
    dispatch(setOpenSignIn())
    dispatch(setCloseSignUp())
  }

  const onOpenSignUp = () => {
    dispatch(setOpenSignUp())
    dispatch(setCloseSignIn())
  }

  return (
    <div>
      <Auth />
      <div className={styles.core_header}>
        <h1 className={styles.core_title}>Insta Clone</h1>
        {myProfile?.nickName ? (
          <>
            <button className={styles.core_btnModal} onClick={onOpenNewPost}>
              <MdAddAPhoto />
            </button>
            <div className={styles.core_logout}>
              {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
              <Button onClick={onLogout}>Log out</Button>
              <button className={styles.core_btnModal} onClick={onOpenProf}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  variant="dot"
                >
                  <Avatar alt="who?" src={myProfile.img} />
                  {''}
                </StyledBadge>
              </button>
            </div>
          </>
        ) : (
          <div>
            <Button onClick={onOpenLogIn}>LogIn</Button>
            <Button onClick={onOpenSignUp}>SignUp</Button>
          </div>
        )}
      </div>

      {myProfile?.nickName && (
        <>
          <Grid container spacing={4}>
            {posts
              .slice(0)
              .reverse()
              .map(post => (
                <Grid key={post.id} item xs={12} md={4}>
                  <Post
                    postId={post.id}
                    title={post.title}
                    loginId={myProfile.userProfile}
                    userPost={post.userPost}
                    imageURL={post.img}
                    liked={post.liked}
                  />
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </div>
  )
})
