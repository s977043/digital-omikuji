import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { MuteToggle } from "../MuteToggle";

describe("MuteToggle", () => {
  it("isMuted=false の場合は ON ラベルと 🔔 アイコンを表示する", () => {
    const { getByText, getByLabelText } = render(
      <MuteToggle isMuted={false} onToggle={jest.fn()} />
    );
    expect(getByText("ON")).toBeTruthy();
    expect(getByText("🔔")).toBeTruthy();
    expect(getByLabelText("音声をオフにする")).toBeTruthy();
  });

  it("isMuted=true の場合は OFF ラベルと 🔕 アイコンを表示する", () => {
    const { getByText, getByLabelText } = render(
      <MuteToggle isMuted={true} onToggle={jest.fn()} />
    );
    expect(getByText("OFF")).toBeTruthy();
    expect(getByText("🔕")).toBeTruthy();
    expect(getByLabelText("音声をオンにする")).toBeTruthy();
  });

  it("タップで onToggle が呼ばれる", () => {
    const onToggle = jest.fn();
    const { getByText } = render(<MuteToggle isMuted={false} onToggle={onToggle} />);
    fireEvent.press(getByText("ON"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
