import * as a from '../../styles/styledComponent/category';
import basicIMG from '../../styles/basicIMG.webp';
import { postType } from '../../types';

interface PostProps {
  post: postType;
  onClick: (post: postType) => Promise<void>;
}

const Post = ({ post, onClick }: PostProps): JSX.Element => {
  return (
    <a.PostContainer>
      <a.PostIMG
        bgPhoto={post.imgURL ? post.imgURL : basicIMG}
        key={post.id}
        onClick={() => onClick(post)}
      />

      <a.ContentContainer>
        <a.InfoBest>{post.category}</a.InfoBest>
        <span>{post.title}</span>
        <p>
          {post.price
            ? post.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : 0}{' '}
          P
        </p>
        <a.BottomContainer>
          <p>{post.nickName}</p>
        </a.BottomContainer>
      </a.ContentContainer>
    </a.PostContainer>
  );
};

export default Post;
