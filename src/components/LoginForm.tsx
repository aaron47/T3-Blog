import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createUserInput } from '../schema/user.schema';
import { trpc } from '../utils/trpc';

interface Props {
  hash: string;
}

const VerifyToken: React.FC<Props> = ({ hash }) => {
  const { data, isLoading } = trpc.useQuery(['users.verify-otp', { hash }]);
  const router = useRouter();

  if (isLoading) {
    return <p>Verifying...</p>;
  }

  router.push(data?.redirect.includes('login') ? '/' : data?.redirect || '/');

  return <p>Redirecting...</p>;
};

const LoginForm = () => {
  const { handleSubmit, register } = useForm<createUserInput>();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(['users.request-otp'], {
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const onSubmit = (values: createUserInput) => {
    mutate({ ...values, redirect: router.asPath });
  };

  const hash = router.asPath.split('#token=')[1];

  if (hash) {
    return <VerifyToken hash={hash} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}

        {success && <p>Check your email</p>}
        <h1>Login</h1>

        <input
          type="email"
          placeholder="jane.doe@example.com"
          {...register('email')}
        />

        <button type="submit">Login</button>
      </form>

      <Link href="/register">Register</Link>
    </>
  );
};

export default LoginForm;
