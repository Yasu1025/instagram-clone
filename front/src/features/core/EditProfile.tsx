import React, { memo, VFC, useState } from 'react'
import Modal from 'react-modal'
import styles from './Core.module.css'

import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'

import { File } from '../types'

import {
  editNickName,
  selectMyProfile,
  selectOpenProfile,
  setCloseProfile,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateProfile,
} from '../auth/authSlice'

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

const EditProfile: VFC = memo(() => {
  const dispatch: AppDispatch = useDispatch()
  const isOpenProfile = useSelector(selectOpenProfile)
  const myProfile = useSelector(selectMyProfile)
  const [image, setImage] = useState<File | null>(null)

  const handlerEditPicture = () => {
    const fileInput = document.getElementById('imageInput')
    fileInput?.click()
  }

  const onUpdateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const packet = {
      id: myProfile.id,
      nickName: myProfile.nickName,
      img: image,
    }

    await dispatch(fetchCredStart())
    await dispatch(fetchAsyncUpdateProfile(packet))
    await dispatch(fetchCredEnd())
    await dispatch(setCloseProfile())
  }

  return (
    <>
      <Modal
        isOpen={isOpenProfile}
        onRequestClose={async () => {
          await dispatch(setCloseProfile())
        }}
        style={customStyles}
      >
        <form className={styles.core_signUp}>
          <h1 className={styles.core_title}>Insta Clone</h1>

          <br />
          <TextField
            placeholder="nickname"
            type="text"
            value={myProfile?.nickName}
            onChange={e => dispatch(editNickName(e.target.value))}
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
            disabled={!myProfile?.nickName}
            variant="contained"
            color="primary"
            type="submit"
            onClick={onUpdateProfile}
          >
            Update
          </Button>
        </form>
      </Modal>
    </>
  )
})

export default EditProfile
