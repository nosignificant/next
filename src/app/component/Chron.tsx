import { Post } from "../lib/type";

export default function Chron(post: Post) {
  return (
    <div className="flex flex-row gap-4">
      {" "}
      <div className="w-5">{post.chron?.year} </div>
      <div className="w-5">{post.chron?.month}</div>
      <div className="w-5">{post.chron?.day}</div>
    </div>
  );
}
