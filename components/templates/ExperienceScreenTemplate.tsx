import React, { useEffect, useRef } from "react";
import {
  findNodeHandle,
  ImageBackground,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { getComponentTokens, getStringToken } from "../../design-system";

type WebStyle = ViewStyle & {
  minHeight?: number | string;
};

const WEB_FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getWebFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(WEB_FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      (element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement)
  );
}

interface ExperienceScreenTemplateProps {
  topBar?: React.ReactNode;
  bottomLeftAction?: React.ReactNode;
  bottomRightAction?: React.ReactNode;
  footer?: React.ReactNode;
  overlay?: React.ReactNode;
  overlayLabel?: string;
  children: React.ReactNode;
}

export function ExperienceScreenTemplate({
  topBar,
  bottomLeftAction,
  bottomRightAction,
  footer,
  overlay,
  overlayLabel,
  children,
}: ExperienceScreenTemplateProps) {
  const { height } = useWindowDimensions();
  const overlayContainerRef = useRef<View | null>(null);
  const canvasColor = getStringToken("semantic.surface.experience.canvas");
  const sceneOverlay = getComponentTokens<{ backgroundColor: string }>("overlay.sceneScrim");
  const hasBottomActions = bottomLeftAction || bottomRightAction;
  const isCompactHeight = height < 720;
  const isOverlayActive = overlay != null;
  const backgroundPointerEvents = isOverlayActive ? "none" : "auto";

  useEffect(() => {
    if (Platform.OS !== "web" || !isOverlayActive) {
      return;
    }

    const overlayCurrent = overlayContainerRef.current as unknown;
    const overlayHandle = findNodeHandle(overlayContainerRef.current) as unknown;
    const overlayElement =
      overlayCurrent instanceof HTMLElement
        ? overlayCurrent
        : overlayHandle instanceof HTMLElement
          ? overlayHandle
          : null;

    if (!overlayElement) {
      return;
    }
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    overlayElement.setAttribute("tabindex", "-1");
    overlayElement.setAttribute("role", "dialog");
    overlayElement.setAttribute("aria-modal", "true");
    if (overlayLabel) {
      overlayElement.setAttribute("aria-label", overlayLabel);
    }

    const focusInitialElement = window.setTimeout(() => {
      const focusableElements = getWebFocusableElements(overlayElement);
      const initialTarget = focusableElements[0] ?? overlayElement;
      initialTarget.focus();
    }, 0);

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getWebFocusableElements(overlayElement);
      if (focusableElements.length === 0) {
        event.preventDefault();
        overlayElement.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const isFocusInsideOverlay = activeElement != null && overlayElement.contains(activeElement);

      if (event.shiftKey) {
        if (!isFocusInsideOverlay || activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (!isFocusInsideOverlay || activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    overlayElement.addEventListener("keydown", trapFocus);

    return () => {
      window.clearTimeout(focusInitialElement);
      overlayElement.removeEventListener("keydown", trapFocus);
      if (previouslyFocusedElement && document.contains(previouslyFocusedElement)) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOverlayActive, overlayLabel]);

  return (
    <View
      className="flex-1"
      style={{
        flex: 1,
        backgroundColor: canvasColor,
        ...(Platform.OS === "web" ? ({ minHeight: "100vh" } as WebStyle) : {}),
      }}
    >
      <ImageBackground
        source={require("../../assets/shrine_background.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: sceneOverlay.backgroundColor,
            position: "relative",
          }}
        >
          {topBar ? (
            <View
              testID="experience-topbar"
              style={{
                paddingHorizontal: 20,
                paddingTop: isCompactHeight ? 28 : 48,
                paddingBottom: isCompactHeight ? 16 : 20,
              }}
              pointerEvents={backgroundPointerEvents}
              accessibilityElementsHidden={isOverlayActive}
              importantForAccessibility={isOverlayActive ? "no-hide-descendants" : "auto"}
              aria-hidden={Platform.OS === "web" ? isOverlayActive : undefined}
            >
              {topBar}
            </View>
          ) : null}
          <ScrollView
            style={{
              flex: 1,
              ...(Platform.OS === "web" ? { pointerEvents: backgroundPointerEvents } : {}),
            }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingTop: 0,
              paddingBottom: isCompactHeight ? 20 : 28,
            }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isOverlayActive}
            pointerEvents={Platform.OS === "web" ? undefined : backgroundPointerEvents}
            accessibilityElementsHidden={isOverlayActive}
            importantForAccessibility={isOverlayActive ? "no-hide-descendants" : "auto"}
            aria-hidden={Platform.OS === "web" ? isOverlayActive : undefined}
          >
            <View
              style={{
                flexGrow: 1,
                alignSelf: "stretch",
                alignItems: "center",
                justifyContent: isCompactHeight ? "flex-start" : "center",
                position: "relative",
                minHeight: 0,
                paddingTop: isCompactHeight ? 8 : 0,
              }}
            >
              {children}
            </View>
            {footer ? (
              <View style={{ alignItems: "center", marginTop: isCompactHeight ? 6 : 10 }}>
                {footer}
              </View>
            ) : null}
            {hasBottomActions ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: isCompactHeight ? 10 : 16,
                }}
              >
                {bottomLeftAction ? (
                  <View style={{ flexShrink: 1 }}>{bottomLeftAction}</View>
                ) : (
                  <View />
                )}
                {bottomRightAction ? (
                  <View style={{ flexShrink: 1 }}>{bottomRightAction}</View>
                ) : null}
              </View>
            ) : null}
          </ScrollView>
          {isOverlayActive ? (
            <View
              ref={overlayContainerRef}
              testID="experience-overlay"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 40,
                backgroundColor: canvasColor,
                ...(Platform.OS === "web" ? { pointerEvents: "auto" } : {}),
              }}
              pointerEvents={Platform.OS === "web" ? undefined : "auto"}
              accessibilityViewIsModal
              accessibilityLabel={overlayLabel}
            >
              {overlay}
            </View>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  );
}
