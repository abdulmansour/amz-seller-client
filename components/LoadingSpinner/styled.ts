import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export interface LoadingSpinnerModalProps {
  loading: number;
}
export const LoadingSpinnerModal = styled(Box)<LoadingSpinnerModalProps>(
  ({ theme, loading }) => ({
    display: loading ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",

    position: "fixed",
    top: "0px",
    left: "0px",
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.6)",

    zIndex: theme.zIndices?.loadingSpinner,
  })
);
