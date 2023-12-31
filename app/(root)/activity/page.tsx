import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();

   if (!user) {
    return null;
   }

   const userInfo = await fetchUser(user.id);

   if (!userInfo?.onboarded) {
    redirect("/onboarding");
   }

   // fetch user's activity
   const results = await getActivity(userInfo._id);

  return (
    <section>
      <h2 className="head-text mb-10">Activities</h2>

      <section className="mt-10 flex flex-col gap-5">
        {results.length > 0 ? (
          <>
            {results.map((result) => (
              <Link key={result.id} href={`/thread/${result.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={result.author.image}
                    alt={result.title}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {result.author.name}
                    </span>{" "}
                    replied to your post.
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="text-base-regular text-light-3">No Activities yet</p>
        )}
      </section>
    </section>
  )
}