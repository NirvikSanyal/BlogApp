import { Link } from 'react-router-dom';
import { getMediaUrl } from '../api';

const PostCard = ({ post }) => {
  const excerpt = post.body.length > 100 
    ? `${post.body.substring(0, 100)}...` 
    : post.body;

  return (
    <div className="post-card">
      {post.image && <img className="post-card-image" src={getMediaUrl(post.image)} alt="" />}
      <div className="post-meta"><span>{post.author?.name || 'Unknown writer'}</span><span>{new Date(post.createdAt).toLocaleDateString()}</span></div>
      <h3>{post.title}</h3>
      <p>{excerpt}</p>
      <Link to={`/posts/${post._id}`} className="read-more">Read More</Link>
    </div>
  );
};

export default PostCard;
