import React, { useCallback, useState } from "react";
import { Alert, Platform, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { HistoryEntry, clearHistory, getHistory } from "../utils/HistoryStorage";
import { navigateBackOrReplace } from "../utils/navigation";
import { VersionDisplay } from "../components/VersionDisplay";
import { HistoryScreenTemplate } from "../components/templates/HistoryScreenTemplate";
import { PageHeader } from "../components/design-system/PageHeader";
import { Button } from "../components/design-system/Button";
import { HistoryListPattern } from "../components/patterns/HistoryListPattern";
import { getStringToken } from "../design-system";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    const data = await getHistory();
    setHistory(data);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleBack = useCallback(() => {
    navigateBackOrReplace(router);
  }, []);

  const handleClearHistory = useCallback(async () => {
    const title = t("history.deleteConfirmTitle");
    const message = t("history.deleteConfirmMessage");

    if (Platform.OS === "web") {
      const confirmed = window.confirm(message);
      if (confirmed) {
        await clearHistory();
        setHistory([]);
      }
      return;
    }

    Alert.alert(title, message, [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        },
      },
    ]);
  }, [t]);

  const header = (
    <PageHeader
      title={t("history.title")}
      subtitle="これまで授かった運勢を静かに振り返れます"
      tone="experience"
      actionPlacement="stacked"
      leadingAction={<Button label={t("common.back")} onPress={handleBack} variant="textLink" />}
      trailingAction={
        history.length > 0 ? (
          <Button label={t("history.deleteAll")} onPress={handleClearHistory} variant="textLink" />
        ) : undefined
      }
    />
  );

  return (
    <HistoryScreenTemplate
      header={header}
      content={
        isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: getStringToken("semantic.text.muted"), fontSize: 16 }}>
              読み込み中...
            </Text>
          </View>
        ) : (
          <HistoryListPattern history={history} />
        )
      }
      footer={<VersionDisplay />}
    />
  );
}
