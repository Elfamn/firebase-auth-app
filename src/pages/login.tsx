import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/home');
    }
  }, [currentUser, router]);

  return (
    <>
      <Head>
        <title>Login | Firebase Auth App</title>
      </Head>
      <LoginForm />
    </>
  );
}