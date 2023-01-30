import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export interface LoadingSpinnerModalProps {
  loading: number;
}
export const LoadingSpinnerModal = styled(Box)<LoadingSpinnerModalProps>`
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
