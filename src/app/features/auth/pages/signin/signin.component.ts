import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  @Output() formData: EventEmitter<{
    email: string;
    password: string;
  }> = new EventEmitter();

  testEmail : string = 'speedyneppl@gmail.com';
  testPassword : string = 'Ins1derTr@ding';
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [this.testEmail, [Validators.required, Validators.email]],
      password: [this.testPassword, Validators.required],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    console.log('onSubmit');
    this.formData.emit(this.form.value);
  }
}


// import React, { useState } from 'react';
// import { withRouter, Link } from 'react-router-dom';
// import { compose } from 'recompose';

// import { PasswordForgetLink } from '../PasswordForget';
// import { EmailSignInLink } from '../EmailSignIn';
// import { withFirebase } from '../Firebase';
// import * as ROUTES from '../../constants/routes';

// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Alert from 'react-bootstrap/Alert';
// import Col from 'react-bootstrap/Col';
// import Row from 'react-bootstrap/Row';
// import Container from 'react-bootstrap/Container';

// import { Formik } from 'formik';
// import * as yup from 'yup';

// const schema = yup.object({
//   email: yup.string().email()
//     .required('Required'),
//   password: yup.string().required("Required")
// });

// const style = {
//   maxWidth: "600px",
//   minWidth: "300px",
//   width: "75%",
// }

// const SignInPage = () => (
//   <>
//     <Container className="app-top">
//       <Row>
//         <Col className="d-flex justify-content-center align-items-center">
//           <div style={style}>
//             <h1 className="text-center">Sign In</h1>
//             <SignInForm />
//           </div>
//         </Col>

//       </Row>
//     </Container>
//   </>
// );


// const SignInFormBase = ({ firebase, history }) => {
//   const [error, setError] = useState(null);

//   const onSubmit = (values, { resetForm }) => {
//     const { email, password } = values;

//     firebase
//       .doSignInWithEmailAndPassword(email, password)
//       .then(() => {
//         setError(null);
//         resetForm({});
//         history.push(ROUTES.USER_PROGRAM);
//       })
//       .catch(error => {
//         setError(error);
//       });
//   };

//   return (
//     <Formik
//       validationSchema={schema}
//       onSubmit={onSubmit}
//       initialValues={{
//         email: '',
//         password: '',
//       }}
//     >
//       {({
//         handleSubmit,
//         handleChange,
//         handleBlur,
//         values,
//         touched,
//         isValid,
//         errors,
//       }) => (
//         <Form className="w-100" noValidate onSubmit={handleSubmit}>
//           <Form.Group md="4" controlId="validationFormikUsername">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={values.email}
//               onChange={handleChange}
//               isInvalid={!!errors.email}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.email}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group md="4" >
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               name="password"
//               value={values.password}
//               onChange={handleChange}
//               isInvalid={!!errors.password}
//               placeholder="Password"
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.password}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <div className="d-flex justify-content-between">
//             <PasswordForgetLink />
//             <EmailSignInLink />
//           </div>

//           <hr></hr>

//           <Button block variant="primary" type="submit">
//             Sign In
//                      </Button>

//           {error && <Alert className="mt-3" variant="warning">{error.message}</Alert>}
//         </Form>
//       )}
//     </Formik>
//   );
// }

// const SignInLink = ({ color }) => (
//   <p style={{ color: color }}>
//     Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
//   </p>
// );


// const SignInForm = compose(
//   withRouter,
//   withFirebase,
// )(SignInFormBase);


// export default SignInPage;

// export { SignInForm, SignInLink };
