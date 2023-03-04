import styled from 'styled-components';

//Transaction 스타일
export const TransactionContainer = styled.div`
  width: 60%;
  margin: 0 auto;
`;



export const TransactionWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4rem;
  margin-bottom: 24px;
`;

export const SellerImage = styled.div<{ img: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 490px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.gray10};
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.img});
`;

export const SellerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  height: 490px;
  h2 {
    font-size: 24px;
    font-weight: ${(props) => props.theme.fontWeight.bold};
    color: ${(props) => props.theme.colors.gray60};
  }

  p {
    width: 100%;
    font-size: 20px;
    font-weight: ${(props) => props.theme.fontWeight.bold};
    text-align: right;
  }
  span {
    font-size: 20px;
  }
`;

export const ProfileContainer = styled.div`
  width: 100%;
  height: 240px;
  box-shadow: 1px 1px 5px ${(props) => props.theme.colors.gray20};
`;

export const ProfileWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 5rem;
  background-color: rgba(255, 218, 24, 0.8);
`;

export const ProfileLeft = styled.div`
  position: relative;
  width: 30%;
`;

export const ProfileIMG = styled.div<{ profileIMG: string }>`
  position: absolute;
  width: 100px;
  height: 100px;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -50%);
  border-radius: 100%;
  background-image: url(${(props) => props.profileIMG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const ProfileRight = styled.div`
  display: flex;
  align-items: flex-end;
  width: 70%;
  margin-bottom: 0.5rem;
  p {
    font-size: 20px;
  }
`;

export const ProfileBottom = styled.div`
  width: 100%;
  height: 11rem;
`;

export const ProfileBottomContainer = styled.div`
  display: flex;
  justify-content: right;
  align-items: flex-start;
  height: 50%;
`;

export const ProfileBottomWrapper = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 0.7rem 1.5rem;
  gap: 0.5rem;
  p {
    font-size: 20px;
  }
  span {
    font-size: 12px;
    color: ${(props) => props.theme.colors.gray20};
  }
`;

export const ProfileBottomInfo = styled.div`
  height: 50%;
  div {
    width: 90%;
    margin: 0 auto;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
  }
  button {
    width: 100%;
    height: 64px;
    font-size: 16px;
    background-color: yellow;
    border: none;
    &:hover {
      box-shadow: 2px 2px 4px ${(props) => props.theme.colors.gray20};
    }
  }
`;

export const SellerLikeWrapper = styled.div`
  display: flex;
  gap: 3rem;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 4rem;
    color: ${(props) => props.theme.colors.gray40};
    font-size: 20px;
    background-color: yellow;
    border: none;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
      box-shadow: 1px 1px 3px ${(props) => props.theme.colors.gray20};
    }
  }
`;

export const TransactionPost = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  gap: 2.5rem;
  margin-bottom: 24px;
  div {
    padding: 2rem;
    width: 100%;
    min-height: 20rem;
    border: 2px solid yellow;
  }
`;
