import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SearchBar from "@/components/forms/SearchBar";


export default async function Page({ searchParams }: { searchParams: { q: string } }) {
  const q = searchParams?.q || "";

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userInfo  = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const result = await fetchUsers({
    searchString: q,
    userId: user.id,
    pageNumber: 1,
    pageSize: 25,
  });
  
  return (
    <section>
      <h2 className="head-text mb-10">Search</h2>

      {/** render a search bar */}
      <SearchBar
        placeholder="Search for a user"
      />

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No result</p>
        ) : (
          <>
            {result.users.map((person) => {
              return (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
                />
              )
            })}
          </>
        )}
      </div>
    </section>
  )
}