import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { IdleRitualPattern } from "../IdleRitualPattern";

describe("IdleRitualPattern", () => {
  it("shows the 'draw' copy and CTA when the user has not drawn today", () => {
    const onDraw = jest.fn();
    const onShowResult = jest.fn();
    const { getByText, getByRole, queryByRole } = render(
      <IdleRitualPattern hasDrawnToday={false} onDraw={onDraw} onShowResult={onShowResult} />
    );

    expect(getByText(/静かに息を整えて/)).toBeTruthy();
    expect(getByRole("button", { name: "おみくじを引く" })).toBeTruthy();
    expect(queryByRole("button", { name: "結果をもう一度見る" })).toBeNull();
  });

  it("invokes onDraw when the draw CTA is pressed", () => {
    const onDraw = jest.fn();
    const onShowResult = jest.fn();
    const { getByRole } = render(
      <IdleRitualPattern hasDrawnToday={false} onDraw={onDraw} onShowResult={onShowResult} />
    );

    fireEvent.press(getByRole("button", { name: "おみくじを引く" }));

    expect(onDraw).toHaveBeenCalledTimes(1);
    expect(onShowResult).not.toHaveBeenCalled();
  });

  it("switches to the 'review' copy and CTA once drawn today", () => {
    const onDraw = jest.fn();
    const onShowResult = jest.fn();
    const { getByText, getByRole, queryByRole } = render(
      <IdleRitualPattern hasDrawnToday={true} onDraw={onDraw} onShowResult={onShowResult} />
    );

    expect(getByText(/本日の運勢はすでに授かっています/)).toBeTruthy();
    expect(getByRole("button", { name: "結果をもう一度見る" })).toBeTruthy();
    expect(queryByRole("button", { name: "おみくじを引く" })).toBeNull();
  });

  it("invokes onShowResult when the review CTA is pressed", () => {
    const onDraw = jest.fn();
    const onShowResult = jest.fn();
    const { getByRole } = render(
      <IdleRitualPattern hasDrawnToday={true} onDraw={onDraw} onShowResult={onShowResult} />
    );

    fireEvent.press(getByRole("button", { name: "結果をもう一度見る" }));

    expect(onShowResult).toHaveBeenCalledTimes(1);
    expect(onDraw).not.toHaveBeenCalled();
  });
});
