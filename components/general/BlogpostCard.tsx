import Image from "next/image";
import Link from "next/link";
interface iappProps {
  post: {
    id: string;
    title: string;
    content: string;
    game: string;
    authorid: string;
    authorName: string;
    createdat: Date;
    updatedat: Date;
    scheduled: Date;
  };
}

export default function BlogpostCard({ post }: iappProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-b-lg border-gray-200
        bg-white shadow-md transition-all hover:shadow-lg "
    >
      <Link href={`/post/${post.id}`} className="block w-full h-full">
        <div className="p-4">
          <h3 className="mb-2 tex-lg font-semibold text-gray-600">
            {post.title}
          </h3>
          <p className="mb-4 tex-sm font-semibold text-gray-400 line-clamp-3">
            {post.content}
          </p>
          <p className="mb-4 tex-sm font-semibold text-gray-400 line-clamp-3">
            {post.game}
          </p>
          <p className="mb-4 text-sm font-semibold text-gray-400 line-clamp-3">
            {post.scheduled.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
      </Link>
    </div>
  );
}
