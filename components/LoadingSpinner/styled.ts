import styled from "styled-components";

export interface LoadingSpinnerModalProps {
  loading: boolean;
}
export const LoadingSpinnerModal = styled.div<LoadingSpinnerModalProps>`
  display: ${(props) => (props.loading ? "flex" : "none")};
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
`;
