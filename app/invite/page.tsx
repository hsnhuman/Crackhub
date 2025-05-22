import { prisma } from "../utils/db";
import { auth } from "../auth/auth";
import InviteCard from "@/components/general/InviteCard";

async function getData() {
  const session = await auth();
  const user = session?.user;
  const data = await prisma.invitations.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

async function getpost(blogpostIds) {
  const blogposts = await prisma.blogpost.findMany({
    where: {
      id: { in: blogpostIds }, // Use `in` to match multiple IDs
    },
  });

  return blogposts;
}

async function readinvite() {
  const session = await auth();
  const user = session?.user;
  const reading = await prisma.invitations.updateMany({
    where: {
      userId: user?.id,
    },
    data: { read: true },
  });
  return reading;
}

export default async function Inviteroute() {
  const data = await getData();
  const blogpostIds = data.map((port) => port.blogpostId);
  const bpost = await getpost(blogpostIds);
  readinvite();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-8 relative font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        <h2 className="text-3xl font-semibold text-white shadow-lg">
          Your invites
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white text-xl font-medium">No invites found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((post) => {
              const correspondingBlogPost = bpost.find(
                (bp) => bp.id === post.blogpostId
              );

              return (
                <div
                  key={post.id}
                  className="bg-white bg-opacity-80 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-4"
                >
                  <InviteCard post={post} bpost={correspondingBlogPost} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
