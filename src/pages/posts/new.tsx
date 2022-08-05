import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { createPostInput } from '../../schema/post.schema';
import { trpc } from '../../utils/trpc';

function createPostPage() {
  const { handleSubmit, register } = useForm<createPostInput>();
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(['posts.create-post'], {
    onSuccess: ({ id }) => {
      router.push(`/posts/${id}`);
    },
  });

  function onSubmit(values: createPostInput) {
    mutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && error.message}

      <h1>Create Post</h1>

      <input type="text" placeholder="Your post title" {...register('title')} />
      <br />
      <textarea {...register('body')}></textarea>
      <br />
      <button>Create Post</button>
    </form>
  );
}

export default createPostPage;
