import CommunityCard from "@/components/cards/CommunityCard";
import SearchBar from "@/components/forms/SearchBar";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs";

export default async function CommunitiesPage({ searchParams }: { searchParams: { q: string } }) {
  const q = searchParams?.q || "";

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const result = await fetchCommunities({
    searchString: q,
    pageNumber: 1,
    pageSize: 25,
  });


  return (
    <section>
      {/** render a search bar */}
      <h1 className="head-text mb-10">Communities</h1>
      <SearchBar
        placeholder="Search for a community..."
      />
      
      {/** render a list of communities */}
    {result?.communities?.length === 0 ? (
      <p className="text-center text-gray-1 text-base-medium mt-10">
        No communities found
      </p>) : (
        
      <div className="grid grid-cols-1 gap-4 mt-10">
        {result.communities.map((community) => (
          <CommunityCard
            key={community.id}
            id={community.id}
            name={community.name}
            username={community.username}
            bio={community.bio}
            imgUrl={community.image}
            members={community.members}
          />
        ))}
      </div>)}
    </section>
  )
}