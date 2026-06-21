import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ConfidenceRing = ({ score }: { score: number }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const color = score >= 80 ? '#2E7D32' : score >= 50 ? '#E65100' : '#BA1A1A';

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [score]);

  if (Platform.OS === 'web') {
    return (
      <View style={{ width: '100%', height: 20, backgroundColor: '#E0E0E0', borderRadius: 10, overflow: 'hidden' }}>
        <Animated.View
          style={{
            width: animatedValue.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
            height: '100%',
            backgroundColor: color,
            borderRadius: 10,
          }}
        />
        <Text style={{ position: 'absolute', alignSelf: 'center', fontWeight: 'bold', color: '#000' }}>{score}%</Text>
      </View>
    );
  }

  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r={radius} stroke="#E0E0E0" strokeWidth={strokeWidth} fill="none" />
        <AnimatedCircle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin="50, 50"
        />
      </Svg>
      <Animated.Text style={{ position: 'absolute', fontSize: 22, fontWeight: 'bold', color }}>{score}%</Animated.Text>
    </View>
  );
};
