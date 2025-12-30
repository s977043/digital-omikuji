import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FortuneDisplay from '../FortuneDisplay';
import { OmikujiFortune } from '../../constants/OmikujiData';

// Mock react-native-view-shot
jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn(),
}));

// Mock moti
jest.mock('moti', () => {
  const { View } = require('react-native');
  return {
    MotiView: View,
  };
});

describe('FortuneDisplay', () => {
  const mockOnReset = jest.fn();

  const mockFortune: OmikujiFortune = {
    result: '大吉',
    message: '2026年はあなたの黄金イヤー！夢が叶う最高の年になるでしょう。',
    weight: 10,
    color: '#FFD700',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fortune が渡された時に結果が表示される', () => {
    const { getByText } = render(
      <FortuneDisplay fortune={mockFortune} onReset={mockOnReset} />
    );

    expect(getByText('大吉')).toBeTruthy();
  });

  it('fortune が渡された時にメッセージが表示される', () => {
    const { getByText } = render(
      <FortuneDisplay fortune={mockFortune} onReset={mockOnReset} />
    );

    expect(getByText(mockFortune.message)).toBeTruthy();
  });

  it('閉じるボタンを押すと onReset が呼ばれる', () => {
    const { getByText } = render(
      <FortuneDisplay fortune={mockFortune} onReset={mockOnReset} />
    );

    fireEvent.press(getByText('閉じる'));

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('シェアボタンが表示される', () => {
    const { getByText } = render(
      <FortuneDisplay fortune={mockFortune} onReset={mockOnReset} />
    );

    expect(getByText(/シェア/)).toBeTruthy();
  });

  it('異なる運勢結果が正しく表示される', () => {
    const kyoFortune: OmikujiFortune = {
      result: '凶',
      message: '今は耐える時。慎重に行動すれば、災いは転じて福となります。',
      weight: 5,
      color: '#808080',
    };

    const { getByText } = render(
      <FortuneDisplay fortune={kyoFortune} onReset={mockOnReset} />
    );

    expect(getByText('凶')).toBeTruthy();
    expect(getByText(kyoFortune.message)).toBeTruthy();
  });
});
