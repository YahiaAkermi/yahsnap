import { useUserContext } from '@/context/AuthContext';

type filterSectionProps={
    handleClick:any ,
    id:any
}



const FilterSection = ({handleClick,id}:filterSectionProps) => {
    const { user } = useUserContext();
    
  return (
    <div className="w-full relative">
    <div className="flex max-lg:justify-center items-center">
      <div
        className="flex-center gap-3 bg-dark-3 px-4 py-2 cursor-pointer hover:bg-dark-4 rounded-l-lg min-w-48 max-lg:min-w-24"
        onClick={() => handleClick('posts')}
      >
        <img src="/assets/icons/post-icon.svg" alt="Posts Icon" />
        Posts
      </div>
      <div className="flex-center gap-3 bg-dark-3 px-4 py-2 cursor-pointer hover:bg-dark-4 min-w-48 max-lg:min-w-24">
        {user.id === id ? (
          <div className="flex items-center gap-2" onClick={() => handleClick('likedPosts')}>
            <img src="/assets/icons/liked.svg" alt="Liked Icon" />
            <span>Liked Posts</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <img src="/assets/icons/tagged.png" alt="Tagged Icon" />
            <span>Reels</span>
          </div>
        )}
      </div>
      <div
        className="flex-center gap-3 bg-dark-3 px-4 py-2 cursor-pointer hover:bg-dark-4 rounded-r-lg min-w-48 max-lg:min-w-24"
      >
        <img src="/assets/icons/tagged.png" alt="Tagged Icon" />
        Tagged
      </div>
    </div>
    <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer absolute right-1 top-0 max-lg:hidden">
      <p className="small-medium md:base-medium text-light-2">All</p>
      <img
        src="/assets/icons/filter.svg"
        width={20}
        height={20}
        alt="Filter Icon"
      />
    </div>
  </div>
  )
}

export default FilterSection