// components/screen-header.tsx
import { COLORS, SPACING } from '@/constants/commonStyles';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  animationDelay?: number;
}

export const ScreenHeader = ({ title, subtitle, animationDelay = 0 }: ScreenHeaderProps) => {
  return (
    <Animated.View 
      entering={animationDelay > 0 ? 
        FadeInUp.delay(animationDelay).duration(800) : 
        FadeInUp.duration(700)
      } 
      style={{ 
        paddingHorizontal: SPACING.XXL, 
        paddingTop: 60, 
        paddingBottom: subtitle ? 25 : 40,
        alignItems: 'center',
      }}
    >
      <Text style={[
        {
          color: COLORS.PRIMARY_TINT, 
          fontSize: 30,
          fontWeight: '900',
          textAlign: 'center',
          marginBottom: subtitle ? 12 : 18,
        }
      ]}>
        {title}
      </Text>
      
      {subtitle && (
        <Text style={[
          {
            color: COLORS.TEXT_SECONDARY, 
            fontSize: 16,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 18,
          }
        ]}>
          {subtitle}
        </Text>
      )}
      
      <View style={{ 
        width: 80, 
        height: 4, 
        backgroundColor: COLORS.PRIMARY_TINT, 
        borderRadius: 2, 
        opacity: 0.8
      }} />
    </Animated.View>
  );
};
