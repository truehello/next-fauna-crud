import Link from "next/link";
import TextTruncate from "react-text-truncate";
import YouTube from "react-youtube";

const walkCard = ({ data }) => {

  //console.log("in walkcard")

  const opts = {
    
    height: "100%",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

    return (
        <li
              key={data._id}
              className="flex flex-col justify-between p-4 bg-opacity-75 bg-gradient-to-r from-purple-700 to-blue-500 text-gray-100 rounded"
            >
              <div>
                <div className="relative w-full" style={{paddingBottom: '56.6%'}}>
                <YouTube videoId={data.video_id} opts={opts} className="absolute top-0 left-0"/>
                </div>

                <p className="mt-4 text-lg font-semibold">{data.name}</p>
                {/* <p>location: {data.location}</p> */}
                <div className="flex justify-between pt-2 pb-4">
                  <p className="text-sm">{data.date}</p>
                  <p className="text-sm">
                    {data.city}, {data.country}
                  </p>
                </div>

                <TextTruncate
                  line={3}
                  element="p"
                  truncateText="…"
                  text={data.description}
                  className="text-gray-200 tracking-tight pt-2"
                />
              </div>
              <div className="flex justify-end pt-4">
                <Link href="/walk/[id]" as={`/walk/${data._id}`}>
                  <a className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
                    Visit
                  </a>
                </Link>
              </div>
            </li>
    )
}

export default walkCard
