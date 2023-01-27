import React, { CSSProperties } from "react";
import { ClipLoader } from "react-spinners";
import { LoadingSpinnerModal } from "./styled";

export interface LoadingSpinnerProps extends CSSProperties {
  loading: boolean;
}

export const LoadingSpinner = ({
  color = "#EA4336",
  loading,
}: LoadingSpinnerProps) => {
  return (
    <LoadingSpinnerModal loading={loading}>
      <ClipLoader color={color} loading={loading} />
    </LoadingSpinnerModal>
  );
};
