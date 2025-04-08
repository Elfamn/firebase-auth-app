import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {
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
        <title>Register | Firebase Auth App</title>
      </Head>
      <RegisterForm />
    </>
  );
}