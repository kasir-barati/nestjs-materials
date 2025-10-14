import { PostType } from '../enums';
import { NewsPost } from '../schemas/news-post.schema';
import { TechPost } from '../schemas/tech-post.schema';

type TechPostMap = {
  type: PostType.TECH;
} & TechPost;
type NewsPostMap = {
  type: PostType.NEWS;
} & NewsPost;

export type PostTypeUnion = TechPostMap | NewsPostMap;

/**
 * @description
 * Type guard to check if a post type is TECH
 */
export function isTechPost(
  postType: PostTypeUnion,
): postType is TechPostMap {
  return postType.type === PostType.TECH;
}

/**
 * @description
 * Type guard to check if a post type is NEWS
 */
export function isNewsPost(
  postType: PostTypeUnion,
): postType is NewsPostMap {
  return postType.type === PostType.NEWS;
}
