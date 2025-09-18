import { Post } from "../lib/type";

export default function Chron(post: Post) {
  return (
    <div className="flex font-pretendard items-center">
      {/*가로 여백*/}
      <div className="w-10 px-1">{post.chron?.year && post.chron?.year}</div>
      <div className="w-10 px-1">
        {post.chron?.month ? `${post.chron.month}월` : ""}
      </div>
      <div className="w-10 px-1">
        {post.chron?.day ? `${post.chron.day}일` : ""}
      </div>
    </div>
  );
}

/*
이렇게 쓰면 틀린 것 
<div className="w-10 inline-block">{`${post.chron?.month} 월`}</div>
 */
