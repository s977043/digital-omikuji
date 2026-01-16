import React from "react";
import { OmikujiResult } from "../types/omikuji";
import { ResultScrollCard } from "./ResultScrollCard";

interface FortuneDisplayProps {
  fortune: OmikujiResult;
  onReset: () => void;
  reducedMotion?: boolean;
  hasSelectedAction?: boolean;
}

export default function FortuneDisplay({
  fortune,
  onReset,
  reducedMotion = false,
  hasSelectedAction = false,
}: FortuneDisplayProps) {
  return (
    <ResultScrollCard
      fortune={fortune}
      onReset={onReset}
      reducedMotion={reducedMotion}
      hasSelectedAction={hasSelectedAction}
    />
  );
}
