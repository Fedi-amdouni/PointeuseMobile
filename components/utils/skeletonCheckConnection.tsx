import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';

const dotSize = 12;
const iconSize = 60;
const numberOfRows = 3; // Fixed number of rows

interface SkeletonCheckConnectionProps {
  message?: string;
  numberOfDots?: number;
  SkeletonRightIcon?: React.ComponentType<any>;
  SkeletonLeftIcon?: React.ComponentType<any>;
  isVisible?: boolean; 
}

const SkeletonCheckConnection: React.FC<SkeletonCheckConnectionProps> = ({
  numberOfDots = 7,
  message,
  SkeletonLeftIcon: LeftIcon = () => null,
  SkeletonRightIcon: RightIcon = () => null,
  isVisible = false, 
}) => {
  if (!isVisible) return null;

  const numberOfColumns = Math.ceil(numberOfDots / numberOfRows); // Calculate columns dynamically
  const dots = Array.from({ length: numberOfDots });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <LeftIcon name="monitor" size={iconSize} color="#9e9e9e" />
        
        <View style={[styles.dotsContainer, { width: numberOfColumns * (dotSize + 8) }]}>
          {dots.map((_, index) => (
            <Dot key={index} index={index} />
          ))}
        </View>
        
        <RightIcon name="cloud" size={iconSize} color="#9e9e9e" />
      </View>

      {message && (
        <Text style={[styles.message, { color: '#1976d2' }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const Dot: React.FC<{ index: number }> = ({ index }) => {
  const scaleValue = new Animated.Value(1);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    setTimeout(() => animation.start(), index * 100);
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.dot,
        { transform: [{ scale: scaleValue }] },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: '#1976d2',
    margin: 4,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
});

export default SkeletonCheckConnection;
