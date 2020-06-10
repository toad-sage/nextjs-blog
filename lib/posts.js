import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

const postDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // Get file names under /posts
  const filenames = fs.readdirSync(postDirectory);
  const allPostsData = filenames.map((filename) => {
    // Remove .md from filename to get id
    const id = filename.replace(/\.md$/, '');

    // Read markdown file as string
    const fullpath = path.join(postDirectory, filename);
    const fileContents = fs.readFileSync(fullpath, 'utf-8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // combine data with id
    return {
      id,
      ...matterResult.data,
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Important: The returned list is not just an array of strings
// — it must be an array of objects that look like the comment above.
// Each object must have the params key and contain an
// object with the id key (because we’re using [id] in the file name). Otherwise, getStaticPaths will fail.

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postDirectory);
  return fileNames.map((filename) => {
    return {
      params: {
        id: filename.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id) {
  const fullpath = path.join(postDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullpath, 'utf-8');

  const matterResult = matter(fileContents);
  // use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
