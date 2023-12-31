import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const threadId = params.id;
  const user = await currentUser();

  // return if there is no valid thread id
  if (!threadId) {
    return null;
  }

  // check if the user is logged in
  if (!user) {
    return null;
  }

  const userInfo = await fetchUser(user.id);

  // redirect user to onboarding page if the user is not onboarded
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  // fetch the thread
  const thread = await fetchThreadById(threadId);
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          content={thread.text}
          parentId={thread.parentId}
          comments={thread.children}
          createdAt={thread.createdAt}
          community={thread.community}
          author={thread.author}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={threadId}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((comment: any) => (
          <ThreadCard
            key={comment._id}
            id={comment._id}
            currentUserId={comment?.id}
            content={comment.text}
            parentId={comment.parentId}
            comments={comment.children}
            createdAt={comment.createdAt}
            community={comment.community}
            author={comment.author}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
}
