import Head from 'next/head';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <>
      <Head>
        <title>Forgot Password | Firebase Auth App</title>
      </Head>
      <ForgotPasswordForm />
    </>
  );
}