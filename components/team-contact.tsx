import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CommonStyles, { COLORS, SPACING } from '@/constants/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function ContactScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipientEmail = params.recipientEmail as string;
  const recipientName = params.recipientName as string;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const backgroundColor = COLORS.BACKGROUND_DARK;
  const cardColor = COLORS.CARD_BACKGROUND;
  const tint = COLORS.PRIMARY_TINT;
  const textColor = COLORS.TEXT_LIGHT;

  // Set recipient info when component mounts
  useEffect(() => {
    if (recipientName) {
      setFormData(prev => ({
        ...prev,
        subject: `Message for ${recipientName}`
      }));
    }
  }, [recipientName]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', subject: '', message: '' };
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get the computer's IP address from environment
      const ipAddress = process.env.EXPO_PUBLIC_SERVER_IP;
      const port = process.env.EXPO_PUBLIC_SERVER_PORT || '3000';
      
      // Check if IP address is available
      if (!ipAddress) {
        throw new Error('Server IP address not configured. Please check your network settings.');
      }
      
      const url = `http://${ipAddress}:${port}/team-contact`;
      console.log('Sending request to:', url);
      console.log('Request data:', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        recipientEmail: recipientEmail,
        recipientName: recipientName
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          recipientEmail: recipientEmail,
          recipientName: recipientName
        }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (response.ok) {
        Alert.alert('Success!', 'Thank you for your message! We will get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: `Message for ${recipientName}`,
          message: ''
        });
        
        // Clear errors on successful submission
        setErrors({ name: '', email: '', subject: '', message: '' });
      } else {
        // Try to parse error response as JSON, fallback to text if it fails
        let errorMessage = 'Failed to send message';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, get text response
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            // If both fail, use generic message
            errorMessage = 'Failed to send message';
          }
        }
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.log('FAILED...', error);
      
      // Provide more specific error messages based on error type
      let alertMessage = 'Failed to send message. Please try again later.';
      
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        alertMessage = 'Unable to connect to the server. Please ensure you are on the same network as the server and try again.';
      } else if (error.message) {
        alertMessage = error.message;
      }
      
      Alert.alert('Error', alertMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={[CommonStyles.container, { backgroundColor }]}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      
      {/* Back Arrow */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={26} color={tint} />
      </TouchableOpacity>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[CommonStyles.container, { marginVertical: SPACING.XXL }]}
      >
        <ScrollView 
          style={CommonStyles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[CommonStyles.paddingHorizontalMd, { paddingTop: SPACING.XXL }]}
        >
          <ThemedView style={[CommonStyles.center, CommonStyles.marginBottomLg]}>
            <ThemedText type="title" style={[CommonStyles.title, { color: tint, marginBottom: SPACING.SM }]}>
              Contact {recipientName || 'Team Member'}
            </ThemedText>
            <ThemedText style={[CommonStyles.bodyText, { color: COLORS.TEXT_SECONDARY, textAlign: 'center' }]}>
              Send a direct message to {recipientName || 'this team member'}. We'll get back to you as soon as possible.
            </ThemedText>
          </ThemedView>
        
          
          <ThemedView style={[CommonStyles.cardWithPadding, { backgroundColor: cardColor }]}>
            <ThemedView style={CommonStyles.inputGroup}>
              <ThemedText style={[CommonStyles.label, { color: textColor }]}>Full Name *</ThemedText>
              <TextInput
                style={[CommonStyles.input, { 
                  backgroundColor: COLORS.BACKGROUND_DARK, 
                  borderColor: errors.name ? COLORS.ERROR_RED : COLORS.BORDER_DEFAULT, 
                  color: textColor 
                }]}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
              />
              {errors.name ? <ThemedText style={CommonStyles.errorText}>{errors.name}</ThemedText> : null}
            </ThemedView>
            
            <ThemedView style={CommonStyles.inputGroup}>
              <ThemedText style={[CommonStyles.label, { color: textColor }]}>Email Address *</ThemedText>
              <TextInput
                style={[CommonStyles.input, { 
                  backgroundColor: COLORS.BACKGROUND_DARK, 
                  borderColor: errors.email ? COLORS.ERROR_RED : COLORS.BORDER_DEFAULT, 
                  color: textColor 
                }]}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
              />
              {errors.email ? <ThemedText style={CommonStyles.errorText}>{errors.email}</ThemedText> : null}
            </ThemedView>
            
            <ThemedView style={CommonStyles.inputGroup}>
              <ThemedText style={[CommonStyles.label, { color: textColor }]}>Subject </ThemedText>
              <TextInput
                style={[CommonStyles.input, { 
                  backgroundColor: COLORS.BACKGROUND_DARK, 
                  borderColor: errors.subject ? COLORS.ERROR_RED : COLORS.BORDER_DEFAULT, 
                  color: textColor 
                }]}
                value={formData.subject}
                onChangeText={(value) => handleInputChange('subject', value)}
                placeholder="Enter subject"
                placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
              />
              {errors.subject ? <ThemedText style={CommonStyles.errorText}>{errors.subject}</ThemedText> : null}
            </ThemedView>
            
            <ThemedView style={CommonStyles.inputGroup}>
              <ThemedText style={[CommonStyles.label, { color: textColor }]}>Message *</ThemedText>
              <TextInput
                style={[CommonStyles.textArea, { 
                  backgroundColor: COLORS.BACKGROUND_DARK, 
                  borderColor: errors.message ? COLORS.ERROR_RED : COLORS.BORDER_DEFAULT, 
                  color: textColor 
                }]}
                value={formData.message}
                onChangeText={(value) => handleInputChange('message', value)}
                placeholder="Enter your message"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
              />
              {errors.message ? <ThemedText style={CommonStyles.errorText}>{errors.message}</ThemedText> : null}
            </ThemedView>
            
            <TouchableOpacity 
              style={[CommonStyles.primaryButton, { backgroundColor: tint }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ThemedText style={CommonStyles.primaryButtonText}>Sending...</ThemedText>
              ) : (
                <ThemedText style={CommonStyles.primaryButtonText}>Send Message</ThemedText>
              )}
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(15, 23, 43, 0.9)', // Dark background with higher opacity
    borderRadius: 20,
    elevation: 8, // Increased elevation
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 8 }, // Increased shadow offset
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
    alignItems: 'center',
  }
});
