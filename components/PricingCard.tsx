import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Assuming 'ThemedText' and 'ThemedView' are from your project and handle dark/light themes

// You might need to install 'expo-vector-icons' or similar for a better checkmark
// For simplicity, we'll use a standard Text icon here.
// import { Ionicons } from '@expo/vector-icons'; 

interface PricingCardProps {
  title: string;
  price: string;
  period: string; // e.g., "/mo"
  features: string[];
  isPopular?: boolean;
  onSubscribe: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  features,
  isPopular = false,
  onSubscribe,
}) => {
  // Define colors based on popularity
  const primaryColor = isPopular ? '#FF6B6B' : '#4A90E2'; // Vibrant red/pink for popular, classic blue otherwise
  const secondaryColor = isPopular ? '#FFF5F5' : '#F0F7FF'; // Light background for popular
  const buttonTextColor = isPopular ? '#FFFFFF' : '#FFFFFF';

  return (
    <View style={[
      cardStyles.card, 
      { backgroundColor: isPopular ? secondaryColor : '#FFFFFF' },
      isPopular && cardStyles.popularCardShadow, // Add distinct shadow for popular card
    ]}>
      {isPopular && (
        <View style={[cardStyles.popularBadge, { backgroundColor: primaryColor }]}>
          <Text style={cardStyles.popularText}>BEST VALUE</Text>
        </View>
      )}
      
      <Text style={[cardStyles.title, { color: primaryColor }]}>{title}</Text>
      
      <View style={cardStyles.priceContainer}>
        <Text style={cardStyles.price}>${price}</Text>
        <Text style={cardStyles.period}>{period}</Text>
      </View>
      
      <View style={cardStyles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={cardStyles.featureRow}>
            {/* Using a simple Text checkmark, replace with an Icon component (e.g., Ionicons) for better look */}
            <Text style={[cardStyles.checkmark, { color: primaryColor }]}>✓</Text>
            <Text style={cardStyles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={[cardStyles.button, { backgroundColor: primaryColor }]} 
        onPress={onSubscribe}
      >
        <Text style={[cardStyles.buttonText, { color: buttonTextColor }]}>
          Start Free Trial
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 24,
    marginVertical: 12,
    marginHorizontal: 16,
    // Base shadow (subtle lift)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEFEF', // Light border
    position: 'relative',
  },
  popularCardShadow: {
    // Enhanced shadow for the 'Popular' card to make it pop
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderColor: '#FF6B6B30', // A lighter version of the popular color for the border
    transform: [{ scale: 1.05 }], // Slight scale to emphasize
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    zIndex: 1,
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800', // Extra bold title
    textAlign: 'center',
    marginBottom: 8,
    // The color is set dynamically based on 'isPopular'
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE', // Separator line
  },
  price: {
    fontSize: 52, // Larger price font
    fontWeight: '800',
    marginRight: 4,
    // Color is inherited from the parent Text/ThemedText or set globally
    color: '#333',
  },
  period: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#888',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    // The color is set dynamically based on 'isPopular'
  },
  featureText: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    // Background color is set dynamically based on 'isPopular'
    shadowColor: '#000', // Adding a small button shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    // Color is set dynamically to white
  },
});