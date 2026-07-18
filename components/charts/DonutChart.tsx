import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const CHART_COLORS = [
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

interface DonutSegment {
  name: string;
  value: number;
  fraction?: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  fontFamily?: string;
}

export function DonutChart({
  segments,
  size = 200,
  strokeWidth = 32,
  centerLabel,
  centerValue,
  fontFamily = "System",
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <G origin={`${size / 2}, ${size / 2}`}>
            {segments.map((segment, index) => {
              if (segment.value <= 0) return null;

              const pct = segment.value / total;
              const strokeLength = circumference * pct;
              const dashOffset = -accumulatedOffset;
              accumulatedOffset += strokeLength;
              const color = CHART_COLORS[index % CHART_COLORS.length];

              return (
                <Circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                />
              );
            })}
          </G>
        </Svg>
        <View style={styles.centerContainer}>
          {centerValue ? (
            <Text style={[styles.centerValue, { fontFamily }]}>
              {centerValue}
            </Text>
          ) : null}
          {centerLabel ? (
            <Text style={[styles.centerLabel, { fontFamily }]}>
              {centerLabel}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {segments.map((segment, index) => {
          if (segment.value <= 0) return null;
          const pct = ((segment.value / total) * 100).toFixed(1);
          const color = CHART_COLORS[index % CHART_COLORS.length];

          return (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text
                style={[styles.legendText, { fontFamily }]}
                numberOfLines={1}
              >
                {segment.name}
              </Text>
              <Text style={[styles.legendPercent, { fontFamily }]}>{pct}%</Text>
              {segment.fraction ? (
                <Text style={[styles.legendFraction, { fontFamily }]}>
                  {segment.fraction}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  chartContainer: { position: "relative" },
  centerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#888",
    marginTop: 2,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
    gap: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
    maxWidth: 80,
  },
  legendPercent: {
    fontSize: 11,
    fontWeight: "700",
    color: "#333",
  },
  legendFraction: {
    fontSize: 10,
    fontWeight: "400",
    color: "#888",
  },
});
