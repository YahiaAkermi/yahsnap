import { stories } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "../scroll-area"




const Stories = () => {



  return (
    <ScrollArea className="w-[700px] whitespace-nowrap rounded-md  p-1">
    <div className="flex justify-between items-center p-4 gap-10 w-max">
    {stories.map((story,index)=>(
                    <div className="flex flex-col justify-between items-center gap-2" key={index}>
                            <div className="border-4 border-light-3 rounded-full">
                                <img src={story.img} alt="story" />
                            </div>
                            <p className="text-light-2 text-sm">{story.title}</p>
                    </div>
                ))}
    </div>
    <ScrollBar orientation="horizontal"  />
  </ScrollArea>
  )
}

export default Stories