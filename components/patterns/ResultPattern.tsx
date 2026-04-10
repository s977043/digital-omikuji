import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { OmikujiResult } from "../../types/omikuji";
import { DETAIL_KEYS } from "../../data/omikujiData";
import { buildShareText } from "../../utils/buildShareText";
import { getFortuneText } from "../../utils/getFortuneText";
import { FortuneDetailEntry, PaperResultCard } from "../design-system/PaperResultCard";

interface ResultPatternProps {
  fortune: OmikujiResult;
  onReset: () => void;
  reducedMotion?: boolean;
}

export function ResultPattern({ fortune, onReset, reducedMotion = false }: ResultPatternProps) {
  const { t } = useTranslation();

  const { title: fortuneTitle, message: fortuneMessage } = useMemo(
    () => getFortuneText(t, fortune.level, fortune.messageIndex),
    [t, fortune.level, fortune.messageIndex]
  );

  const detailEntries = useMemo<FortuneDetailEntry[]>(
    () =>
      DETAIL_KEYS.map((key) => ({
        key,
        label: t(`fortune.detailLabels.${key}`),
        value: t(`fortune.details.${fortune.level}.${key}`),
      })),
    [t, fortune.level]
  );

  const shareText = useMemo(
    () => buildShareText({ title: fortuneTitle, description: fortuneMessage }),
    [fortuneTitle, fortuneMessage]
  );

  return (
    <PaperResultCard
      fortune={fortune}
      fortuneTitle={fortuneTitle}
      fortuneMessage={fortuneMessage}
      detailEntries={detailEntries}
      shareText={shareText}
      onReset={onReset}
      reducedMotion={reducedMotion}
    />
  );
}
