import React from 'react'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { Formik, Form, Field } from 'formik'
import TextField from 'components/common/wrappers/TheHelpedFormikTextField'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { passwordRegex, emailRegex } from 'utils/constants'
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress
} from '@material-ui/core'
import { authBackend } from 'httpCall'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    form: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%',
        justify: 'center'
      }
    }
  })
)

const formValidationSchema = () =>
  Yup.object().shape({
    email: Yup.string()
      .matches(emailRegex, 'Invalid email address')
      .required('Email required'),
    password: Yup.string()
      .matches(passwordRegex, 'Password weak')
      .required('Password required')
  })

const SignIn: React.FC = () => {
  const classes = useStyles()
  let routerHistory = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const redirectMilliseconds = 500
  
  const onSubmitClick = async (values: any, { setSubmitting }: any) => {
      try {
        await authBackend.post('auth/signIn', {
          email: values.email,
          password: values.password
        })
        setSubmitting(false)
        routerHistory.push('/')
      } catch (err) {
        setSubmitting(false)
        enqueueSnackbar(err.message ?? err, {
          variant: 'error',
          autoHideDuration: redirectMilliseconds
        })
        if (err.code === 'UserNotFoundException') {
          // The error happens when the supplied username/email does not exist in the Cognito user pool
          setTimeout(() => {
            routerHistory.push('/auth/register')
          }, redirectMilliseconds)
        }
      }
  }
  return (
    <React.Fragment>
      <Box mb={2} pl={1}>
        <Typography variant="h4" color="textSecondary">
          Sign In
        </Typography>
      </Box>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={formValidationSchema}
        onSubmit={onSubmitClick}
      >
        {({ submitForm, isSubmitting }) => (
          <Form className={classes.form}>
            <Field component={TextField} name="email" label="Email"></Field>
            <Field
              component={TextField}
              type="password"
              name="password"
              label="Password"
            />

            <Grid container spacing={10} justify="space-between">
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  disableElevation
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  {!isSubmitting ? 'Submit' : <CircularProgress size={14} />}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  disableElevation
                  color="inherit"
                  component={RouterLink}
                  to="/auth/signUp"
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default SignIn
