import React from "react";
import { OmikujiResult } from "../../types/omikuji";
import { PaperResultCard } from "../design-system/PaperResultCard";

interface ResultPatternProps {
  fortune: OmikujiResult;
  onReset: () => void;
  reducedMotion?: boolean;
}

export function ResultPattern({ fortune, onReset, reducedMotion = false }: ResultPatternProps) {
  return <PaperResultCard fortune={fortune} onReset={onReset} reducedMotion={reducedMotion} />;
}
