import React, { memo, VFC } from 'react'
import { AppDispatch } from '../../app/store'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Auth.module.css'
import Modal from 'react-modal'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  fetchAsyncRegister,
  fetchAsyncLogin,
  fetchAsyncCreateMyProfile,
  fetchAsyncGetMyProfile,
} from './authSlice'
import {
  fetchCredStart,
  fetchCredEnd,
  setOpenSignIn,
  setCloseSignIn,
  setOpenSignUp,
  setCloseSignUp,
  setOpenProfile,
  setCloseProfile,
  editNickName,
  selectIsLoadingAuth,
  selectOpenSignIn,
  selectOpenSignUp,
} from './authSlice'
import { Button, CircularProgress, TextField } from '@material-ui/core'
import { fetchAsyncGetAllProfiles } from './authSlice'
import { PROPS_AUTH } from '../types'

const customStyles = {
  overlay: {
    backgroundColor: '#777777',
  },
  content: {
    top: '55%',
    left: '50%',

    width: 280,
    height: 350,
    padding: '50px',

    transform: 'translate(-50%, -50%)',
  },
}

// TODO: create modal component out from this component

export const Auth: VFC = memo(() => {
  Modal.setAppElement('#root')
  const isLoadingAuth = useSelector(selectIsLoadingAuth)
  const openSignIn = useSelector(selectOpenSignIn)
  const openSignUp = useSelector(selectOpenSignUp)
  const dispatch: AppDispatch = useDispatch()

  const onSignUp = async (values: PROPS_AUTH) => {
    await dispatch(fetchCredStart())
    const resultReg = await dispatch(fetchAsyncRegister(values))
    if (fetchAsyncRegister.fulfilled.match(resultReg)) {
      await dispatch(fetchAsyncLogin(values))
      await dispatch(fetchAsyncCreateMyProfile({ nickname: 'anonymoous' }))

      await dispatch(fetchAsyncGetAllProfiles())
      // await dispatch(fetchAsyncGetPosts()) // from post slice
      // await dispatch(fetchAsyncGetComments()) // from comment slice
      await dispatch(fetchAsyncGetMyProfile())
    }
    await dispatch(fetchCredEnd())
    await dispatch(setCloseSignUp())
  }

  const onSingIn = async (values: PROPS_AUTH) => {
    await dispatch(fetchCredStart())
    const result = await dispatch(fetchAsyncLogin(values))
    if (fetchAsyncLogin.fulfilled.match(result)) {
      await dispatch(fetchAsyncGetAllProfiles())
      // await dispatch(fetchAsyncGetPosts())
      // await dispatch(fetchAsyncGetComments())
      await dispatch(fetchAsyncGetMyProfile())
    }
    await dispatch(fetchCredEnd())
    await dispatch(setCloseSignIn())
  }

  return (
    <>
      <Modal
        isOpen={openSignUp}
        onRequestClose={async () => {
          await dispatch(setCloseSignUp())
        }}
        style={customStyles}
      >
        <Formik
          initialErrors={{ email: 'required...' }}
          initialValues={{ email: '', password: '' }}
          onSubmit={values => onSignUp(values)}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('email format is wrong...')
              .required('email is required...'),
            password: Yup.string().required('password is required...').min(4),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <div>
              <form onSubmit={handleSubmit}>
                <div className={styles.auth_signUp}>
                  <h1 className={styles.auth_title}>Insta Clone</h1>
                  <br />
                  <div className={styles.auth_progress}>
                    {isLoadingAuth && <CircularProgress />}
                  </div>

                  <TextField
                    placeholder="email"
                    type="input"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {touched.email && errors.email ? (
                    <div className={styles.auth_error}>{errors.email}</div>
                  ) : null}

                  <br />

                  <TextField
                    placeholder="password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <br />
                  {touched.password && errors.password ? (
                    <div className={styles.auth_error}>{errors.password}</div>
                  ) : null}

                  <br />
                  <br />

                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isValid}
                    type="submit"
                  >
                    Register
                  </Button>

                  <br />
                  <br />

                  <span
                    className={styles.auth_text}
                    onClick={async () => {
                      await dispatch(setOpenSignIn())
                      await dispatch(setCloseSignUp())
                    }}
                  >
                    You already have an account?
                  </span>
                </div>
              </form>
            </div>
          )}
        </Formik>
      </Modal>

      <Modal
        isOpen={openSignIn}
        onRequestClose={async () => {
          await dispatch(setCloseSignIn())
        }}
        style={customStyles}
      >
        <Formik
          initialErrors={{ email: 'required...' }}
          initialValues={{ email: '', password: '' }}
          onSubmit={values => onSingIn(values)}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('email format is wrong...')
              .required('email is required...'),
            password: Yup.string().required('password is required...').min(4),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <div>
              <form onSubmit={handleSubmit}>
                <div className={styles.auth_signUp}>
                  <h1 className={styles.auth_title}>Insta Clone</h1>
                  <br />
                  <div className={styles.auth_progress}>
                    {isLoadingAuth && <CircularProgress />}
                  </div>

                  <TextField
                    placeholder="email"
                    type="input"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {touched.email && errors.email ? (
                    <div className={styles.auth_error}>{errors.email}</div>
                  ) : null}

                  <br />

                  <TextField
                    placeholder="password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <br />
                  {touched.password && errors.password ? (
                    <div className={styles.auth_error}>{errors.password}</div>
                  ) : null}

                  <br />
                  <br />

                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isValid}
                    type="submit"
                  >
                    Login
                  </Button>

                  <br />
                  <br />

                  <span
                    className={styles.auth_text}
                    onClick={async () => {
                      await dispatch(setOpenSignUp())
                      await dispatch(setCloseSignIn())
                    }}
                  >
                    You don't have an account?
                  </span>
                </div>
              </form>
            </div>
          )}
        </Formik>
      </Modal>
    </>
  )
})
