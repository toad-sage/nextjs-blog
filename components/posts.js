import useSWR from 'swr';
import fetch from 'unfetch';

const fetcher = (url) => fetch(url).then((r) => r.json());

function Posts() {
  const { data, error } = useSWR(
    'https://jsonplaceholder.typicode.com/posts/',
    fetch,
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return <div>{console.log(data)}</div>;
}

export default Posts;
