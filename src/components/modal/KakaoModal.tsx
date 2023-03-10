import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getPostsId, getUsers } from '../../api';
import { userProfileAtom, viewKakaoModalAtom } from '../../atom';
import { CustomModal } from './CustomModal';
import styled from 'styled-components';

const KakaoModal = () => {
  const { postId } = useParams();
  const location = useLocation();
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [isModalActive, setIsModalActive] = useRecoilState(viewKakaoModalAtom);

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = isModalActive ? 'hidden' : 'auto';
      return () => {
        body.style.overflow = 'auto';
      };
    }
  }, [isModalActive]);

  const { data: post } = useQuery(['post', postId], () => getPostsId(postId), {
    staleTime: Infinity, // 캐시된 데이터가 만료되지 않도록 한다.
  });

  const { data: seller } = useQuery(
    ['user', post?.[0]?.sellerUid],
    () => getUsers(post?.[0]?.sellerUid),
    {
      enabled: Boolean(post?.[0]?.sellerUid), // post?.[0].sellerUid가 존재할 때만 쿼리를 시작
      staleTime: Infinity,
    }
  );
  const isDetailPage = location.pathname === '/detail';

  const profile = isDetailPage ? seller : userProfile;
  
  return (
    <>
      {isModalActive ? (
        <CustomModal
          modal={isModalActive}
          setModal={setIsModalActive}
          width="600"
          height="400"
          overflow="hidden"
          element={
            <Container>
              <Title>문의하기</Title>
              <KakaoInfoContainer>
                <KakaoInfo>
                  하단에 적힌<span> 카카오톡 ID</span>로 연락해서
                </KakaoInfo>
                <KakaoInfo>판매자에게 궁금한 점을 물어보세요!</KakaoInfo>
              </KakaoInfoContainer>
              <Seller>
                {profile?.nickName}
                <span>님의</span> 카카오톡 ID 입니다.
              </Seller>
              <KakaoIdContainer>
                <KakaoIdTitle>카카오톡ID</KakaoIdTitle>
                <KakaoId>
                  {profile?.kakaoId
                    ? profile?.kakaoId
                    : 'ID가 등록되지 않았습니다.'}
                </KakaoId>
              </KakaoIdContainer>
            </Container>
          }
        />
      ) : (
        ''
      )}
    </>
  );
};

export default KakaoModal;

const Container = styled.div`
  width: 500px;
  height: 251px;
  margin: 80px;
  text-align: center;
  color: ${(props) => props.theme.colors.black};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title32};
`;

const KakaoInfoContainer = styled.div`
  width: 100%;
  height: 51px;
  margin: 32px 0;
`;

const KakaoInfo = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title16};
  color: ${(props) => props.theme.colors.gray20};
  margin-bottom: 8px;

  span {
    font-size: ${(props) => props.theme.fontSize.title18};
    font-weight: ${(props) => props.theme.fontWeight.medium};
    line-height: ${(props) => props.theme.lineHeight.title18};
    color: ${(props) => props.theme.colors.orange02Main};
  }
`;

const Seller = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  line-height: ${(props) => props.theme.lineHeight.title16};
  margin-bottom: 24px;

  span {
    font-weight: ${(props) => props.theme.fontWeight.regular};
  }
`;

const KakaoIdContainer = styled.div`
  width: 100%;
  height: 56px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  border-radius: 10px;
  padding: 16px 0;
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
`;

const KakaoIdTitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title16};
  color: ${(props) => props.theme.colors.gray30};
`;

const KakaoId = styled.p`
  font-size: ${(props) => props.theme.fontSize.title16};
  font-weight: ${(props) => props.theme.fontWeight.regular};
  line-height: ${(props) => props.theme.lineHeight.title16};
  color: ${(props) => props.theme.colors.black};
`;
