import Link from 'next/link'

type Post = {
     slug: string
     title: string
}

async function getPosts(): Promise<Post[]> {
     return [
          { slug: 'home-post', title: 'Home' },
          { slug: 'product-post', title: 'Product' },
          { slug: 'signin-post', title: 'Signin' },
          { slug: 'item-post', title: 'Item' },
          { slug: 'carousel-post', title: 'Carousel' },
          { slug: 'mainproduct-post', title: 'Main Product' },
          { slug: 'image-post', title: 'Image' },
     ]
}

export default async function Post() {
     const posts = await getPosts()

     return (
          <ul>
               {posts.map((post: any) => (
                    <li key={post.slug}>
                         <Link href={`/${post.slug}`}>{post.title}</Link>
                    </li>
               ))}
          </ul>
     )
}
