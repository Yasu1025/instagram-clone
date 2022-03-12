import React, { VFC, useState, memo } from 'react'
import styles from './Post.module.css'

import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Divider, Checkbox } from '@material-ui/core'
import { Favorite, FavoriteBorder } from '@material-ui/icons'

import AvatarGroup from '@material-ui/lab/AvatarGroup'

import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'

import { selectProfiles } from '../auth/authSlice'

import {
  selectComments,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncPostComment,
  fetchAsyncPatchLiked,
} from './postSlice'

import { PROPS_POST } from '../types'

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}))

export const Post: VFC<PROPS_POST> = memo(
  ({ postId, title, loginId, userPost, imageURL, liked }) => {
    const dispatch: AppDispatch = useDispatch()
    const classes = useStyles()
    const profiles = useSelector(selectProfiles)
    const comments = useSelector(selectComments)
    const [text, setText] = useState('') // for comment input

    const getCommentsOnPost = comments.filter(com => com.post === postId)
    const prof = profiles.filter(prof => prof.userProfile === userPost)[0]

    const postComment = async (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      const packet = { text: text, post: postId }
      await dispatch(fetchPostStart())
      await dispatch(fetchAsyncPostComment(packet))
      await dispatch(fetchPostEnd())
      setText('')
    }

    const onLiked = async () => {
      const packet = {
        id: postId,
        title: title,
        current: liked,
        new: loginId,
      }
      await dispatch(fetchPostStart())
      await dispatch(fetchAsyncPatchLiked(packet))
      await dispatch(fetchPostEnd())
    }

    if (title) {
      return (
        <div className={styles.post}>
          <div className={styles.post_header}>
            <Avatar className={styles.post_avatar} src={prof.img} />
            <h3>{prof.nickName}</h3>
          </div>
          <img className={styles.post_image} src={imageURL} alt="" />

          <h4 className={styles.post_text}>
            <Checkbox
              className={styles.post_checkBox}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              checked={liked.some(like => like === loginId)}
              onChange={onLiked}
            />
            <br />
            <strong> {prof.nickName}</strong> {title}
            <AvatarGroup max={7}>
              {liked.map(like => (
                <Avatar
                  className={styles.post_avatarGroup}
                  key={like}
                  src={profiles.find(prof => prof.userProfile === like)?.img}
                />
              ))}
            </AvatarGroup>
          </h4>

          <Divider />
          {/* Comments */}
          <div className={styles.post_comments}>
            {getCommentsOnPost.map(comment => (
              <div key={comment.id} className={styles.post_comment}>
                <Avatar
                  src={
                    profiles.find(
                      prof => prof.userProfile === comment.userComment
                    )?.img
                  }
                  className={classes.small}
                />
                <p>
                  <strong className={styles.post_strong}>
                    {
                      profiles.find(
                        prof => prof.userProfile === comment.userComment
                      )?.nickName
                    }
                  </strong>
                  {comment.text}
                </p>
              </div>
            ))}
          </div>

          <form className={styles.post_commentBox}>
            <input
              className={styles.post_input}
              type="text"
              placeholder="add a comment"
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button
              disabled={!text.length}
              className={styles.post_button}
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        </div>
      )
    }
    return null
  }
)
