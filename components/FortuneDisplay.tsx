import React from "react";
import { OmikujiResult } from "../types/omikuji";
import { ResultPattern } from "./patterns/ResultPattern";

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
  return <ResultPattern fortune={fortune} onReset={onReset} reducedMotion={reducedMotion} />;
}
