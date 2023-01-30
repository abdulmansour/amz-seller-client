import { CircularProgress } from "@mui/material";
import React, { CSSProperties } from "react";
import { LoadingSpinnerModal } from "./styled";

export interface LoadingSpinnerProps extends CSSProperties {
  loading: number;
}

export const LoadingSpinner = ({ loading }: LoadingSpinnerProps) => {
  return (
    <LoadingSpinnerModal loading={loading}>
      <CircularProgress color="error" />
    </LoadingSpinnerModal>
  );
};
