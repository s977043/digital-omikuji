import React, { useRef } from "react";
import { View } from "react-native";
import { OmikujiResult } from "../types/omikuji";
import { ResultScrollCard } from "./ResultScrollCard";

interface FortuneDisplayProps {
  fortune: OmikujiResult;
  onReset: () => void;
}

export default function FortuneDisplay({
  fortune,
  onReset,
}: FortuneDisplayProps) {
  return <ResultScrollCard fortune={fortune} onReset={onReset} />;
}
