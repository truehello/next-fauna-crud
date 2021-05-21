import WalkCard from "./walkCard";

export default function walkList({ data }) {
  //console.log("walklist data", data)
  return (
   
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {data.map((video) => (
          <WalkCard data={video} key={video._id} />
        ))}
      </ul>

  );
}
