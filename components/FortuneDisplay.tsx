import React from "react";
import { OmikujiResult } from "../types/omikuji";
import { ResultScrollCard } from "./ResultScrollCard";

interface FortuneDisplayProps {
  fortune: OmikujiResult;
  onReset: () => void;
  reducedMotion?: boolean;
}

export default function FortuneDisplay({
  fortune,
  onReset,
  reducedMotion = false,
}: FortuneDisplayProps) {
  return <ResultScrollCard fortune={fortune} onReset={onReset} reducedMotion={reducedMotion} />;
}
