import { PostCache } from '#Services/redis/post.cache';
import { UserCache } from '#Services/redis/user.cache';

const postCache: PostCache = new PostCache();
const userCache: UserCache = new UserCache();
