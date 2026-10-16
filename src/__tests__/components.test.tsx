import { fireEvent, render } from "@testing-library/react-native";

import { CategoryCard } from "../screens/HomeScreen";
import { OptionButton } from "../components/OptionButton";
import React from "react";
import { StyleSheet } from "react-native";
import { darkColors } from "../theme";
import { getCategory } from "../data";

jest.mock("../theme-context", () => ({
  useAppTheme: () => ({ colors: jest.requireActual("../theme").darkColors, isDark: true }),
}));
jest.mock("../i18n", () => ({ useT: () => (key: string) => key }));

describe("learning components", () => {
  it("locks options after an answer and marks the correct choice green", () => {
    const onSelect = jest.fn();
    const view = render(<OptionButton option="Correct answer" index={0} selectedIndex={null} correctIndex={0} onSelect={onSelect} />);
    fireEvent.press(view.getByTestId("exercise-option-0"));
    expect(onSelect).toHaveBeenCalledWith(0);

    view.rerender(<OptionButton option="Correct answer" index={0} selectedIndex={0} correctIndex={0} onSelect={onSelect} />);
    const button = view.getByTestId("exercise-option-0");
    expect(StyleSheet.flatten(button.props.style)).toEqual(expect.objectContaining({ borderColor: darkColors.green }));
    fireEvent.press(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("marks a selected incorrect choice red", () => {
    const view = render(<OptionButton option="Wrong answer" index={1} selectedIndex={1} correctIndex={0} onSelect={jest.fn()} />);
    const button = view.getByTestId("exercise-option-1");
    expect(StyleSheet.flatten(button.props.style)).toEqual(expect.objectContaining({ borderColor: darkColors.red }));
  });

  it("fires the category card press callback", () => {
    const category = getCategory("collocations");
    expect(category).toBeDefined();
    const onPress = jest.fn();
    const view = render(<CategoryCard cat={category!} onPress={onPress} />);
    fireEvent.press(view.getByText(category!.title));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});