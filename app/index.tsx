import React from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useOmikujiLogic } from "../hooks/useOmikujiLogic";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useShakeDetection } from "../hooks/useShakeDetection";
import { useAppSettings } from "../hooks/useAppSettings";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { useAppStateMachine } from "../hooks/useAppStateMachine";
import { COMPACT_HEIGHT_BREAKPOINT } from "../constants/layout";
import { VersionDisplay } from "../components/VersionDisplay";
import { ExperienceScreenTemplate } from "../components/templates/ExperienceScreenTemplate";
import { IdleRitualPattern } from "../components/patterns/IdleRitualPattern";
import { ShakingPattern } from "../components/patterns/ShakingPattern";
import { ResultPattern } from "../components/patterns/ResultPattern";
import { RitualProgressOverlay } from "../components/design-system/RitualProgressOverlay";
import { RevealStickStage } from "../components/design-system/RevealStickStage";
import { Button } from "../components/design-system/Button";
import { MuteToggle } from "../components/design-system/MuteToggle";
import { PageHeader } from "../components/design-system/PageHeader";
import { getStringToken } from "../design-system";

const SHAKE_THRESHOLD = 1.8;

export default function OmikujiApp() {
  const { t } = useTranslation();
  const { height: viewportHeight } = useWindowDimensions();
  const { fortune, drawFortune, resetFortune, hasDrawnToday } = useOmikujiLogic();
  const osReducedMotion = useReducedMotion();
  const { settings: appSettings } = useAppSettings();
  const reducedMotion = osReducedMotion || appSettings.forceReducedMotion;
  const { isMuted, toggleMute, playSound } = useSoundEffects();

  const { appState, handleShakeStart, handleResultView, handleReset } = useAppStateMachine({
    reducedMotion,
    drawFortune,
    resetFortune,
    playSound,
    hasDrawnToday,
    hasFortune: fortune !== null,
  });

  const appVariant =
    Constants.expoConfig?.extra?.appVariant ?? (__DEV__ ? "development" : "production");
  const showDebug = appVariant === "development";
  const isCompactLayout = viewportHeight < COMPACT_HEIGHT_BREAKPOINT;

  useShakeDetection({
    enabled: appState === "IDLE" && !hasDrawnToday && appSettings.shakeEnabled,
    threshold: SHAKE_THRESHOLD,
    onShake: handleShakeStart,
  });

  const header = (
    <PageHeader
      title="新春デジタルおみくじ"
      subtitle="静かに引き、丁寧に受け取るための一枚"
      tone="experience"
      leadingAction={<MuteToggle isMuted={isMuted} onToggle={toggleMute} />}
    />
  );

  const historyAction = (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Button
        label="履歴"
        onPress={() => router.push("/history")}
        variant="secondaryQuiet"
        accessibilityLabel="履歴を見る"
        accessibilityHint="これまでに引いたおみくじの履歴を表示します"
      />
      <Button
        label={t("settings.openButton")}
        onPress={() => router.push("/settings")}
        variant="secondaryQuiet"
        accessibilityLabel={t("settings.openButton")}
        accessibilityHint="アプリの設定画面を開きます"
      />
    </View>
  );

  const debugAction = showDebug ? (
    <Button
      label="デバッグ"
      onPress={handleShakeStart}
      variant="utilityWarm"
      accessibilityLabel="デバッグ用に強制実行"
    />
  ) : null;

  return (
    <ExperienceScreenTemplate
      topBar={header}
      bottomLeftAction={appState === "IDLE" ? historyAction : undefined}
      bottomRightAction={appState === "IDLE" ? debugAction : undefined}
      footer={
        appState === "IDLE" && !isCompactLayout ? (
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text
              style={{
                color: getStringToken("semantic.text.experience.hint"),
                fontSize: 11,
                textAlign: "center",
              }}
            >
              {t("disclaimer.inline")}
            </Text>
            <VersionDisplay />
          </View>
        ) : undefined
      }
      overlayLabel={
        appState === "DRAWING"
          ? "運命を紐解いています"
          : appState === "REVEALING"
            ? "おみくじを開いています"
            : appState === "RESULT" && fortune
              ? "おみくじ結果"
              : undefined
      }
      overlay={
        appState === "DRAWING" ? (
          <RitualProgressOverlay reducedMotion={reducedMotion} />
        ) : appState === "REVEALING" ? (
          <RevealStickStage reducedMotion={reducedMotion} />
        ) : appState === "RESULT" && fortune ? (
          <ResultPattern fortune={fortune} onReset={handleReset} reducedMotion={reducedMotion} />
        ) : null
      }
    >
      {appState === "IDLE" ? (
        <IdleRitualPattern
          hasDrawnToday={hasDrawnToday}
          onDraw={handleShakeStart}
          onShowResult={handleResultView}
        />
      ) : null}

      {appState === "SHAKING" ? <ShakingPattern reducedMotion={reducedMotion} /> : null}
    </ExperienceScreenTemplate>
  );
}
