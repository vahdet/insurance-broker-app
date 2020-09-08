import React from 'react'
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles'
import { Formik, Form, Field } from 'formik'
import TextField from 'components/common/wrappers/TheHelpedFormikTextField'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { emailRegex } from 'utils/constants'
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { appBackend } from 'httpCall'

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
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    address: Yup.string().required('Address required'),
    email: Yup.string()
      .matches(emailRegex, 'Invalid email address')
      .required('Email required')
  })

const SignUpBroker: React.FC = () => {
  const classes = useStyles()
  let routerHistory = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  const onSubmitClick = async (values: any, { setSubmitting }: any) => {
    try {
      await appBackend.post(
        'api/users',
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          address: values.address
        },
        { withCredentials: !!process.env.REACT_APP_AUTHENTICATION_ENABLED }
      )

      // Push to sign in page
      if (process.env.REACT_APP_AUTHENTICATION_ENABLED) {
        routerHistory.push('/auth/signIn')
      } else {
        routerHistory.push('/')
      }
    } catch (err) {
      enqueueSnackbar(err.message ?? err, {
        variant: 'error'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <React.Fragment>
      <Box mb={2} pl={1}>
        <Typography variant="h4" color="textSecondary">
          Sign Up New Broker
        </Typography>
      </Box>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          address: ''
        }}
        validationSchema={formValidationSchema}
        onSubmit={onSubmitClick}
      >
        {({ submitForm, isSubmitting }) => (
          <Form className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Field
                  component={TextField}
                  name="firstName"
                  label="First Name"
                ></Field>
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  component={TextField}
                  name="lastName"
                  label="Last Name"
                ></Field>
              </Grid>
            </Grid>
            <Field component={TextField} name="email" label="Email"></Field>
            <Field
              component={TextField}
              name="address"
              label="Address"
              multiline
              rows={3}
            ></Field>

            <Grid container spacing={1}>
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
            </Grid>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  )
}

export default SignUpBroker
