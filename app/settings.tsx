import React, { useCallback } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAppSettings } from "../hooks/useAppSettings";
import { navigateBackOrReplace } from "../utils/navigation";
import { getStringToken } from "../design-system";
import { VersionDisplay } from "../components/VersionDisplay";
import { SubScreenTemplate } from "../components/templates/SubScreenTemplate";
import { PageHeader } from "../components/design-system/PageHeader";
import { SurfaceCard } from "../components/design-system/SurfaceCard";
import { Button } from "../components/design-system/Button";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { settings, update, hydrated } = useAppSettings();

  const handleBack = useCallback(() => {
    navigateBackOrReplace(router);
  }, []);

  const header = (
    <PageHeader
      title={t("settings.title")}
      subtitle={t("settings.subtitle")}
      tone="experience"
      actionPlacement="stacked"
      leadingAction={<Button label={t("common.back")} onPress={handleBack} variant="textLink" />}
    />
  );

  const content = (
    <ScrollView contentContainerStyle={{ paddingVertical: 8, gap: 16 }}>
      <SettingRow
        label={t("settings.shake.label")}
        description={t("settings.shake.description")}
        value={settings.shakeEnabled}
        disabled={!hydrated}
        onChange={(next) => {
          void update({ shakeEnabled: next });
        }}
      />
      <SettingRow
        label={t("settings.reducedMotion.label")}
        description={t("settings.reducedMotion.description")}
        value={settings.forceReducedMotion}
        disabled={!hydrated}
        onChange={(next) => {
          void update({ forceReducedMotion: next });
        }}
      />
    </ScrollView>
  );

  return <SubScreenTemplate header={header} content={content} footer={<VersionDisplay />} />;
}

interface SettingRowProps {
  label: string;
  description: string;
  value: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}

function SettingRow({ label, description, value, disabled, onChange }: SettingRowProps) {
  return (
    <SurfaceCard variant="glassCard" style={{ padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Text
          style={{
            color: getStringToken("semantic.text.primary"),
            fontSize: 16,
            fontWeight: "600",
            flexShrink: 1,
          }}
        >
          {label}
        </Text>
        <Switch
          value={value}
          disabled={disabled}
          onValueChange={onChange}
          accessibilityLabel={label}
        />
      </View>
      <Text
        style={{
          color: getStringToken("semantic.text.muted"),
          fontSize: 13,
          lineHeight: 20,
          marginTop: 8,
        }}
      >
        {description}
      </Text>
    </SurfaceCard>
  );
}
