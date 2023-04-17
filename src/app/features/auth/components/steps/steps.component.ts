import { Component } from '@angular/core';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent {

}


// // Stepwrapper

// import React, { useState } from 'react';
// import join from '../../images/jochum-joy-b-w.jpg';

// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import StepForm from './StepForm';
// import Dots from './Dots';

// const StepWrapper = () => {
//   const [step, setStep] = useState(1);

//   const next = () => {
//     setStep(step >= 2 ? 3 : step + 1);
//   }

//   const prev = () => {
//     setStep(step <= 1 ? 1 : step - 1);
//   }

//   return (
//     <>
//       <Container fluid>
//         <Row>
//           <Col
//             className="container-info px-0"
//             xs={12}
//             xl={{ span: 6, offset: 6 }}
//           >
//             <Dots step={step} />
//             <div className='px-5 py-5 d-flex align-items-center justify-content-center'>
//               <StepForm step={step} next={next} prev={prev} />
//             </div>
//           </Col>
//         </Row>
//         <div className="container-image" style={{ backgroundImage: `url(${join})` }}></div>
//       </Container>
//     </>
//   )
// };

// export default StepWrapper;


// // Step form

// import React, { useState } from "react";
// import InfoForm from './InfoForm';
// import Payment from './PaymentFull';
// import { withFirebase } from '../Firebase';
// import moment from 'moment';

// const StepForm = ({ step, next, prev, firebase }) => {
//   const initialValues = {
//     username: "",
//     email: "",
//     passwordOne: "",
//   }
//   const [formValues, setFormValues] = useState(initialValues);

//   const infoStepSubmit = (values, resetForm) => {
//     setFormValues(values);
//     next();
//   };

//   const paymentStepSubmit = () => {
//     createUser();
//     next();
//   };

//   const createUser = () => {
//     const timestamp = Number(moment().format("x"));
//     const { username, email, passwordOne } = formValues;

//     firebase
//       .doTestCreateUserWithEmailAndPassword(email, passwordOne)
//       .then((authUser) => {
//         console.log("user created");
//         authUser.user.sendEmailVerification({
//           url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT || process.env.REACT_APP_DEV_CONFIRMATION_EMAIL_REDIRECT,
//         });

//         const { uid } = authUser.user;

//         firebase.user(uid).set({
//           username,
//           email,
//           ADMIN: false,
//           ACTIVE: true,
//           createdAt: timestamp,
//           programDate: null,
//           unread: null,
//         });

//         const text = "Welcome Message";

//         const messageObject = {
//           text,
//           userId: "welcome_message_id",
//           username: "Welcome",
//           createdAt: timestamp,
//         };

//         firebase.user(uid).child("unread").push(messageObject)
//         firebase.messages(uid).push(messageObject)

//       }).catch(error => console.log(error));
//   }

//   return (
//     <div className="d-flex flex-column payment-sign-up w-100 text-dark">
//       <div className="pb-5 text-center">
//         <h2 className="font-weight-bold">Insider Sign Up</h2>
//         <p className="lead">Our Online Training Platform For People Looking To Level Up Their Lives!</p>
//       </div>
//       <InfoStep step={step} stepSubmit={infoStepSubmit} formValues={formValues} />
//       <PaymentStep step={step} stepSubmit={paymentStepSubmit} email={formValues.email} username={formValues.username} back={prev} />
//       <WelcomeStep step={step} formValues={formValues} />
//     </div>
//   )
// }

// // eslint-disable-next-line no-unused-vars
// const SignUpInfo = () => (
//   <div className="landing-sign-up-wrapper d-flex justify-content-end">
//     <div className="landing-sign-up-content-wrapper col-md-12 col-12">
//       <div className="landing-sign-up-content">
//         <p className="landing-sign-up-caption d-none d-sm-block">Our Online Training Platform For People Looking To Level Up Their Lives!</p>
//         <ul className="fa-ul landing-sign-up-list">
//           <li><span className="fa-li"><i className="fas fa-check"></i></span>Programs That Fit Your Goals</li>
//           <li><span className="fa-li"><i className="fas fa-check"></i></span>Jochum Strength Elite Diet Guideline Ebook</li>
//           <li><span className="fa-li"><i className="fas fa-check"></i></span>Weight and Diet Tracking Within App</li>
//           <li><span className="fa-li"><i className="fas fa-check"></i></span>Contact With Jochum Strength Coach</li>
//         </ul>
//       </div>
//     </div>
//   </div>
// )

// const InfoStep = ({ step, stepSubmit, formValues }) => {
//   if (step !== 1) {
//     return null
//   }
//   return (
//     <div>
//       <h3 className="mb-3">Account Info</h3>
//       <InfoForm formValues={formValues} stepSubmit={stepSubmit} />
//     </div>
//   )
// };

// const PaymentStep = ({ step, stepSubmit, back }) => {
//   if (step !== 2) {
//     return null
//   }
//   return (
//     <div>
//       <h3 className="mb-3">Cart</h3>
//       <Payment stepSubmit={stepSubmit} back={back} />
//     </div>
//   );
// };

// const WelcomeStep = ({ step, formValues }) => {
//   const { email } = formValues;
//   if (step !== 3) {
//     return null
//   }
//   return (
//     <>
//       <h3 className="mb-3">Welcome! Your Subscription Is Complete.</h3>
//       <p>Thank you for subscribing to Jochum Strength Insider.</p>
//       <p>A verification email has been sent to <b>{email}</b>. After verifying your email you can sign in to Jochum Strength Insider to begin the program process.</p>
//     </>
//   )
// };

// export default withFirebase(StepForm);



// // info Step

// import React, { useState } from 'react';

// import { withFirebase } from '../Firebase';
// import { Formik } from 'formik';
// import * as yup from 'yup';

// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Alert from 'react-bootstrap/Alert';

// const SignUpFormBase = ({ firebase, stepSubmit, formValues }) => {
//   // eslint-disable-next-line no-unused-vars
//   const [error, setError] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);

//   const emailRegExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

//   const schema = yup.object({
//     username: yup.string().required("Required"),
//     email: yup.string()
//       .email()
//       .test('checkEmailUnique', 'This email is already registered.', (value) => {
//         const validEmail = emailRegExp.test(value);
//         if (validEmail) {
//           return firebase.fetchSignInMethodsForEmail(value).then((providers) => {
//             const validEmail = providers.length > 0 ? false : true;
//             return validEmail;
//           })
//         } else {
//           return true;
//         }
//       })
//       .required("Required"),
//     passwordOne: yup.string()
//       .min(7, 'Must be at least 7 characters!')
//       .max(24, 'Too Long!')
//       .required('Required'),
//   });

//   const onSubmit = (values, { resetForm }) => {
//     stepSubmit(values, resetForm);
//   };

//   return (
//     <>
//       <Formik
//         validateOnChange={false}
//         validationSchema={schema}
//         onSubmit={onSubmit}
//         initialValues={{ ...formValues }}
//       >
//         {({
//           handleSubmit,
//           handleChange,
//           values,
//           touched,
//           errors,
//         }) => (
//           <Form noValidate onSubmit={handleSubmit}>
//             <Form.Group controlId="validationFormikUsername">
//               <Form.Label>Username</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="username"
//                 placeholder="Full Name"
//                 value={values.username}
//                 onChange={handleChange}
//                 isInvalid={!!errors.username && touched.username}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.username}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={values.email}
//                 onChange={handleChange}
//                 isInvalid={!!errors.email && touched.email}
//                 placeholder="Email Address"
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.email}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Form.Group controlId="validationFormikPasswordOne" className="sign-up-password">
//               <div>
//                 <Form.Label>Password</Form.Label>
//                 <div className="float-right show-pssw" onClick={() => setShowPassword(!showPassword)}>{showPassword
//                   ? <><i className="fas fa-eye-slash"></i> Hide</>
//                   : <><i className="fas fa-eye"></i> Show</>
//                 }</div>
//               </div>
//               <Form.Control
//                 type={showPassword ? "text" : "password"}
//                 name="passwordOne"
//                 placeholder="Password"
//                 value={values.passwordOne}
//                 onChange={handleChange}
//                 isInvalid={!!errors.passwordOne && touched.passwordOne}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.passwordOne}
//               </Form.Control.Feedback>
//             </Form.Group>
//             <Button block variant="success" type="submit" className='py-2 my-3'>Continue To Payment</Button>
//             {error && <Alert className="mt-3" variant="warning">{error.message}</Alert>}
//             <p className="text-center"><i>Sign Up Complete After Payment</i></p>
//           </Form>
//         )}
//       </Formik>
//     </>
//   );
// }

// const SignUpForm = withFirebase(SignUpFormBase);

// export default SignUpForm;
