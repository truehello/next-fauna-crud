import Link from "next/link";


export default function walkList({ before, after }) {
 //console.log("after", after)
  return (
    <div className="mt-4 flex justify-between px-8">
      {before ? (
        <Link href="/walks/[id]" as={`${before}`}>
          <a className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
            Prev
          </a>
        </Link>
      ) : (
        <p>&nbsp;</p>
      )}
      {after ? (
        <Link href={`/walks/[id]`} as={`${after}`}>
          <a className="px-8 py-2 text-lg font-semibold text-white rounded-lg bg-gradient-to-r hover:from-teal-400 hover:to-blue-500 from-pink-600 to-orange-500">
            Next
          </a>
        </Link>
      ) : (
        <p>&nbsp;</p>
      )}
    </div>
  );
}




