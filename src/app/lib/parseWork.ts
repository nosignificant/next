import { Post, GNode, GData, GLink } from "./type";

// ==== 유틸 함수 ====

// 1. 종류별로 sort
/*function sortInType(posts: Post[]) {
  const sortPost: Record<string,Post[]> = posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!sortPost.hasOwnProperty(tag)) {
        sortPost.tag = {};
      }
    });
  });
}
*/

export function forGraphData(posts: Post[]): GData {
  const nodeMap = new Map<string, GNode>(); // 중복 방지
  const links: GLink[] = [];

  for (const post of posts) {
    // 1) 포스트 노드
    const postId = `post:${post.slug}`;
    if (!nodeMap.has(postId)) {
      nodeMap.set(postId, {
        id: postId,
        slug: post.slug,
        label: post.slug,
        type: "post",
        thumbnail: post.thumbnail,
        parent: post.parent,
      });
    }

    for (const tag of post.tags) {
      const tagId = `tag:${tag}`;
      if (!nodeMap.has(tagId)) {
        nodeMap.set(tagId, {
          id: tagId,
          slug: post.slug,

          label: `#${tag}`,
          type: "tag",
        });
      }
      links.push({ source: tagId, target: postId });
    }
  }

  return { nodes: [...nodeMap.values()], links };
}
