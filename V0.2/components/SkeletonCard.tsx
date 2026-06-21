import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export const SkeletonCard = ({ width = '100%', height = 80 }: { width?: number | string; height?: number }) => {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);
  const backgroundColor = shimmer.interpolate({ inputRange: [0, 1], outputRange: ['#E0E0E0', '#F0F0F0'] });
  return <Animated.View style={{ width: typeof width === 'number' ? width : 100, height, backgroundColor, borderRadius: 12, marginBottom: 16, opacity: 0.6 }} />;
};

export const ResultsSkeleton = () => (
  <View style={{ padding: 16 }}>
    <SkeletonCard height={120} />
    <SkeletonCard height={100} />
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </View>
);
