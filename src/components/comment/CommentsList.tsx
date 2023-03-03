import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Fragment, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { commentType } from '../../types';
import { customConfirm } from '../modal/CustomAlert';
import { deleteComments, getPostsId, getUsers, patchUsers } from '../../api';

/**순서
 * 1. 저장된 유저 정보 가져오기
 * 2. 유저의 UID값 가져오기
 * 3. 무한 스크롤 구현하기
 */
const CommentsList = () => {
  const observerElem = useRef<HTMLDivElement | null>(null);
  const { id } = useParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const PAGE_SIZE = 6;
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  const fetchComments = async (page = 0) => {
    const url = `${process.env.REACT_APP_JSON}/comments?postId=${id}`;
    const response = await axios.get(url, {
      params: {
        _page: page,
        _limit: PAGE_SIZE,
        _sort: 'createAt', // createAt 필드를 기준으로 정렬
        _order: 'desc', // 내림차순으로 정렬
      },
    });
    return response.data;
  };

  //무한 스크롤 진행하기
  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['comments', id],
      ({ pageParam = 0 }) => fetchComments(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length + 1;
          return lastPage.length !== 0 ? nextPage : undefined;
        },
      }
    );

  //페이지 관찰 observer넣기
  const handleObserver = useCallback(
    (entries: any) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element = observerElem.current;
    if (element === null) return;
    const option = { threshold: 0 };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [fetchNextPage, hasNextPage, handleObserver]);


  //판매자 uid를 post를 이용해 get하기
  const { data: post } = useQuery(['post', id], () => getPostsId(id), {
    staleTime: Infinity,
  });
  console.log('post: ', post);

  //커맨트 삭제 시 판매자 커맨트 카운트 -1을 위한 판매자 정보 get하기
  const { data: sellerUser } = useQuery(
    ['user', post?.[0].sellerUid],
    () => getUsers(post?.[0].sellerUid),
    {
      staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
    }
  );

  //  comment가 달리면 판매자 user data의 commentsCount가 +1이 된다.
  const { mutate: updateUser } = useMutation(
    (newUser: { commentsCount: number }) =>
      patchUsers(post?.[0].sellerUid, newUser),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', sellerUser?.id]);
      },
    }
  );

  /**댓글 작성 시간을 n분전 으로 출력해주는 함수
   * 7일 이상이 된 댓글은 yyyy-mm-dd hh:mm 형식으로 출력
   */
  const getTimeGap = (creat: number) => {
    const now = new Date(creat);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}.${month}.${date}`;

    return formattedDate;
  };

  return (
    <div>
      <CommentsContainer>
        <CommentTitleText>후기</CommentTitleText>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((comment: commentType) => (
              <CommentContainer key={comment.id}>
                <TopContainer>
                  <NickName>{comment.writerNickName}</NickName>
                  <CreateAt>{getTimeGap(comment.createAt)}</CreateAt>
                </TopContainer>
                <RightContainer>
                  <CommentContent>{comment.content}</CommentContent>
                </RightContainer>
              </CommentContainer>
            ))}
          </Fragment>
        ))}

        {/* <CommentContainer ref={observerElem}>
          {isFetching || isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Scroll to load more posts'
            : 'No more Reviews...'}
        </CommentContainer> */}
      </CommentsContainer>
    </div>
  );
};

export default CommentsList;
const CommentTitleText = styled.p`
  font-size: ${(props) => props.theme.fontSize.ad24};
  font-weight: ${(props) => props.theme.fontWeight.reqular};
  line-height: ${(props) => props.theme.lineHeight.ad24};
  padding-bottom: 28px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;
const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1199px;
  margin-bottom: 240px;
`;

const CommentContainer = styled.div`
  height: 135px;
  display: flex;
  align-items: left;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray20};
`;

const TopContainer = styled.div`
  display: flex;
`;

const ProfileIMG = styled.div<{ profileIMG: string | undefined | null }>`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const NickName = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray50};
  padding-right: 16px;
  border-right: 1px solid ${(props) => props.theme.colors.gray20};
  margin-bottom: 16px;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentContent = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray30};
`;

const CreateAt = styled.p`
  font-size: ${(props) => props.theme.fontSize.title20};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  line-height: ${(props) => props.theme.lineHeight.title20};
  color: ${(props) => props.theme.colors.gray30};
  margin-left: 16px;
`;

const DeleteButton = styled.button`
  width: 3rem;
  height: 35px;
  border: none;
  font-size: 16px;
  background-color: yellow;
  &:hover {
    cursor: pointer;
  }
`;
