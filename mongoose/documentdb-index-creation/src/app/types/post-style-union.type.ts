import { PostStyle } from '../enums';
import { FeaturedPost } from '../schemas/featured-post.schema';
import { StandardPost } from '../schemas/standard-post.schema';

type StandardPostMap = {
  type: PostStyle.STANDARD;
} & StandardPost;
type FeaturedPostMap = {
  type: PostStyle.FEATURED;
} & FeaturedPost;

export type PostStyleUnion = StandardPostMap | FeaturedPostMap;

/**
 * @description
 * Type guard to check if a post type is STANDARD
 */
export function isStandardPost(
  postType: PostStyleUnion,
): postType is StandardPostMap {
  return postType.type === PostStyle.STANDARD;
}

/**
 * @description
 * Type guard to check if a post type is FEATURED
 */
export function isFeaturedPost(
  postType: PostStyleUnion,
): postType is FeaturedPostMap {
  return postType.type === PostStyle.FEATURED;
}
