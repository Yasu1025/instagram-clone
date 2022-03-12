import React, { memo, VFC, useState } from 'react'
import Modal from 'react-modal'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'

import styles from './Core.module.css'

import { File } from '../types'

import {
  selectOpenNewPost,
  setCloseNewPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncPostNewPost,
} from '../post/postSlice'

import { Button, TextField, IconButton } from '@material-ui/core'
import { MdAddAPhoto } from 'react-icons/md'

const customStyles = {
  content: {
    top: '55%',
    left: '50%',

    width: 280,
    height: 220,
    padding: '50px',

    transform: 'translate(-50%, -50%)',
  },
}

const NewPost: VFC = memo(() => {
  const dispatch: AppDispatch = useDispatch()
  const isOpenNewPost = useSelector(selectOpenNewPost)
  const [title, setTitle] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const handlerEditPicture = () => {
    const fileInput = document.getElementById('imageInput')
    fileInput?.click()
  }

  const onPostNewPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const packet = {
      title,
      img: image,
    }

    await dispatch(fetchPostStart())
    await dispatch(fetchAsyncPostNewPost(packet))
    await dispatch(fetchPostEnd())

    setTitle('')
    setImage(null)
    dispatch(setCloseNewPost())
  }

  return (
    <>
      <Modal
        isOpen={isOpenNewPost}
        onRequestClose={async () => {
          await dispatch(setCloseNewPost())
        }}
        style={customStyles}
      >
        <form className={styles.core_signUp}>
          <h1 className={styles.core_title}>SNS clone</h1>

          <br />
          <TextField
            placeholder="Please enter caption"
            type="text"
            onChange={e => setTitle(e.target.value)}
          />

          <input
            type="file"
            id="imageInput"
            hidden={true}
            onChange={e => setImage(e.target.files![0])}
          />
          <br />
          <IconButton onClick={handlerEditPicture}>
            <MdAddAPhoto />
          </IconButton>
          {image && (
            <small>
              Uploaded:
              <br />
              {image.name}
            </small>
          )}
          <br />
          <Button
            disabled={!title || !image}
            variant="contained"
            color="primary"
            onClick={onPostNewPost}
          >
            New post
          </Button>
        </form>
      </Modal>
    </>
  )
})

export default NewPost
