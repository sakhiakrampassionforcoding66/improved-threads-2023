import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  // fetch posts from the database to display in the homepage
  const result = await fetchPosts(1, 30);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10 min-h-screen">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found. Click "Create Threads" to create one</p>
          ) : (
            <>
            {result.posts.map(post => {
              return (
                <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                content={post.text}
                parentId={post.parentId}
                comments={post.children}
                createdAt={post.createdAt}
                community={post.community}
                author={post.author}
                />
                )
              })}
          </>
        )}
      </section>
    </>
  )
}