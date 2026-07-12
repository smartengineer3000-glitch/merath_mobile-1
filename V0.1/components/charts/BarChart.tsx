import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAppTheme } from "../../lib/context/ThemeProvider";

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  barWidth?: number;
  maxValue?: number;
  showLabels?: boolean;
  showValues?: boolean;
  animationDuration?: number;
}

export default function BarChart({
  data,
  height = 160,
  barWidth = 28,
  maxValue,
  showLabels = true,
  showValues = true,
  animationDuration = 600,
}: BarChartProps) {
  const { theme } = useAppTheme();
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const gap = 12;
  const totalWidth = data.length * (barWidth + gap) - gap;

  return (
    <View style={[styles.container, { height: height + (showLabels ? 24 : 0) }]}>
      <View style={styles.barsContainer}>
        {data.map((item, index) => (
          <BarItem
            key={index}
            item={item}
            maxValue={max}
            height={height}
            barWidth={barWidth}
            index={index}
            totalItems={data.length}
            showValues={showValues}
            theme={theme}
            animationDuration={animationDuration}
          />
        ))}
      </View>
      {showLabels && (
        <View style={[styles.labelsContainer, { gap }]}>
          {data.map((item, index) => (
            <View key={index} style={[styles.labelItem, { width: barWidth }]}>
              <Text
                style={[
                  styles.labelText,
                  {
                    color: theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function BarItem({
  item,
  maxValue,
  height,
  barWidth,
  index,
  totalItems,
  showValues,
  theme,
  animationDuration,
}: {
  item: BarChartData;
  maxValue: number;
  height: number;
  barWidth: number;
  index: number;
  totalItems: number;
  showValues: boolean;
  theme: any;
  animationDuration: number;
}) {
  const animatedHeight = useSharedValue(0);
  const fraction = item.value / maxValue;

  useEffect(() => {
    animatedHeight.value = 0;
    animatedHeight.value = withTiming(fraction, {
      duration: animationDuration + index * 100,
      easing: Easing.out(Easing.cubic),
    });
  }, [fraction, animationDuration, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value * height,
  }));

  const barColor = item.color || theme.colors.primary.main;

  return (
    <View style={[styles.barWrapper, { width: barWidth }]}>
      {showValues && (
        <Text
          style={[
            styles.valueText,
            { color: theme.colors.neutral.dark200, fontFamily: theme.fontFamily.english },
          ]}
        >
          {item.value}
        </Text>
      )}
      <View style={[styles.barTrack, { height, backgroundColor: theme.colors.neutral.light100 }]}>
        <Animated.View
          style={[
            styles.barFill,
            animatedStyle,
            { backgroundColor: barColor, borderRadius: 6 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 12,
  },
  barWrapper: {
    alignItems: "center",
  },
  barTrack: {
    width: "100%",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    minHeight: 4,
  },
  valueText: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  labelItem: {
    alignItems: "center",
  },
  labelText: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
});
