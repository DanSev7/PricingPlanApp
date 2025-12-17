// screens/ContactScreen.tsx
import { PrimaryButton } from '@/components/primary-button';
import { ThemedView } from '@/components/themed-view';
import CommonStyles, { COLORS, SPACING } from '@/constants/commonStyles';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// --- Validation Helper ---
const isValidEmail = (email: string) => {
    // Simple regex for email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// --- ERROR TYPE DEFINITION (Optional but good practice) ---
type FormErrors = {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
};

export default function ContactScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    // New state to manage validation errors
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const newErrors: FormErrors = {};
        let isValid = true;

        // 1. Name Validation
        if (!name.trim()) {
            newErrors.name = 'Name / Organization is required.';
            isValid = false;
        }

        // 2. Email Validation
        if (!email.trim()) {
            newErrors.email = 'Email address is required.';
            isValid = false;
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Please enter a valid work email.';
            isValid = false;
        }

        // 3. Subject is optional - no validation needed
        
        // 4. Message Validation
        if (!message.trim()) {
            newErrors.message = 'Your goal/message is required.';
            isValid = false;
        }

        // Update error state
        setErrors(newErrors);

        if (isValid) {
            setIsSubmitting(true);
            
            try {
                // Get the computer's IP address from environment or use localhost as fallback
                const ipAddress = process.env.EXPO_PUBLIC_SERVER_IP || '192.168.1.15';
                const port = process.env.EXPO_PUBLIC_SERVER_PORT || '3000';
                
                const response = await fetch(`http://${ipAddress}:${port}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        ...(subject && { subject }), // Only include subject if it has a value
                        message,
                    }),
                });

                if (response.ok) {
                    // Success Logic: Show success message
                    Alert.alert(
                        'Request Submitted! 🎉',
                        'Thank you for your inquiry! We will be in touch soon to discuss your optimization needs.',
                        [{ text: 'OK' }]
                    );

                    // Clear form fields
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.log('FAILED...', error);
                // Failure Logic: Display error to the user
                Alert.alert(
                    'Submission Failed',
                    'Sorry, we couldn\'t submit your request. Please try again later.',
                    [{ text: 'OK' }]
                );
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Helper function to get input border style based on error state
    const getInputStyle = (field: keyof FormErrors) => [
        CommonStyles.input,
        { 
            backgroundColor: COLORS.BACKGROUND_DARK,
            borderColor: errors[field] ? COLORS.ERROR_RED : COLORS.BORDER_DEFAULT,
            color: COLORS.TEXT_LIGHT
        },
        errors[field] && { borderColor: COLORS.ERROR_RED, borderWidth: 2 },
    ];

    return (
        <ThemedView style={[CommonStyles.container, { backgroundColor: COLORS.BACKGROUND_DARK }]}>
            <KeyboardAvoidingView
                style={CommonStyles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
            >
                <ScrollView style={CommonStyles.container} showsVerticalScrollIndicator={false}>
                    
                    {/* Page Title */}
                    <Animated.View entering={FadeInDown.duration(700)} style={[CommonStyles.center, { 
                        paddingHorizontal: SPACING.XXL, 
                        paddingTop: 60, 
                        paddingBottom: 40 
                    }]}>
                        <Text style={[
                            CommonStyles.title, 
                            { 
                                color: COLORS.PRIMARY_TINT, 
                                fontSize: 34,
                                fontWeight: '900',
                                letterSpacing: -0.5,
                                marginBottom: 12
                            }
                        ]}>
                            Contact Us
                        </Text>
                        <View style={{ 
                            width: 90, 
                            height: 4, 
                            backgroundColor: COLORS.PRIMARY_TINT, 
                            borderRadius: 3, 
                            opacity: 0.8,
                            marginBottom: 8
                        }} />
                        {/* <Text style={[
                            CommonStyles.bodyText, 
                            { 
                                color: COLORS.TEXT_SECONDARY, 
                                fontSize: 17,
                                textAlign: 'center',
                                lineHeight: 28
                            }
                        ]}>
                            Start the conversation about time optimization and leadership effectiveness.
                        </Text> */}
                    </Animated.View>

                    {/* Contact Form Card */}
                    <Animated.View entering={FadeInUp.delay(200).duration(800)} style={[CommonStyles.cardWithPadding, { 
                        marginHorizontal: 22, 
                        marginBottom: 20,
                        backgroundColor: COLORS.CARD_BACKGROUND
                    }]}>
                        <Text style={[
                            CommonStyles.subtitle, 
                            { 
                                color: COLORS.TEXT_LIGHT, 
                                fontSize: 22,
                                fontWeight: '400',
                                marginBottom: 20,
                                textAlign: 'center'
                            }
                        ]}>
                            Tell Us About Your Needs
                        </Text>
                        
                        {/* Name Input */}
                        <Text style={[CommonStyles.label, { color: COLORS.TEXT_LIGHT }]}>Name/Organization *</Text>
                        <TextInput
                            style={getInputStyle('name')}
                            placeholder="Your Name / Organization"
                            placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                // Clear error on change
                                setErrors((prev) => ({ ...prev, name: undefined }));
                            }}
                        />
                        {errors.name && <Text style={CommonStyles.errorText}>{errors.name}</Text>}
                        
                        {/* Email Input */}
                        <Text style={[CommonStyles.label, { color: COLORS.TEXT_LIGHT }]}>Email Address *</Text>
                        <TextInput
                            style={getInputStyle('email')}
                            placeholder="Work Email Address"
                            placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
                            keyboardType="email-address"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setErrors((prev) => ({ ...prev, email: undefined }));
                            }}
                        />
                        {errors.email && <Text style={CommonStyles.errorText}>{errors.email}</Text>}

                        {/* Subject Input */}
                        <Text style={[CommonStyles.label, { color: COLORS.TEXT_LIGHT }]}>Subject</Text>
                        <TextInput
                            style={getInputStyle('subject')}
                            placeholder="Subject"
                            placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
                            value={subject}
                            onChangeText={(text) => {
                                setSubject(text);
                                setErrors((prev) => ({ ...prev, subject: undefined }));
                            }}
                        />
                        {errors.subject && <Text style={CommonStyles.errorText}>{errors.subject}</Text>}

                        {/* Message Input */}
                        <Text style={[CommonStyles.label, { color: COLORS.TEXT_LIGHT }]}>Message *</Text>
                        <TextInput
                            style={[...getInputStyle('message'), { height: 120, textAlignVertical: 'top' }]}
                            placeholder="Your Goal (e.g., 'Improve team efficiency')"
                            placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
                            multiline
                            numberOfLines={4}
                            value={message}
                            onChangeText={(text) => {
                                setMessage(text);
                                setErrors((prev) => ({ ...prev, message: undefined }));
                            }}
                        />
                        {errors.message && <Text style={CommonStyles.errorText}>{errors.message}</Text>}

                        <PrimaryButton
                            title={isSubmitting ? 'Submitting...' : 'Submit Request'}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            style={{ 
                                padding: 18,
                                borderRadius: 99,
                                marginTop: 10,
                            }}
                        />
                    </Animated.View>

                    {/* Direct Contact Info Card */}
                    <Animated.View entering={FadeInUp.delay(400).duration(800)} style={[CommonStyles.cardWithPadding, { 
                        marginHorizontal: 22, 
                        marginBottom: 30,
                        backgroundColor: COLORS.CARD_BACKGROUND
                    }]}>
                        <Text style={[
                            CommonStyles.subtitle, 
                            { 
                                color: COLORS.PRIMARY_TINT, 
                                fontSize: 20,
                                fontWeight: '800',
                                marginBottom: 16,
                                textAlign: 'center'
                            }
                        ]}>
                            Direct Contact
                        </Text>
                        <View style={[CommonStyles.row, { 
                            justifyContent: 'space-between', 
                            paddingVertical: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: '#334155'
                        }]}>
                            <Text style={[
                                CommonStyles.bodyText, 
                                { 
                                    color: COLORS.TEXT_SECONDARY, 
                                    fontSize: 16,
                                    fontWeight: '600'
                                }
                            ]}>
                                Email:
                            </Text>
                            <Text style={[
                                CommonStyles.bodyText, 
                                { 
                                    color: COLORS.TEXT_LIGHT, 
                                    fontSize: 16,
                                    fontWeight: '700'
                                }
                            ]}>
                                info@ethiotechleaders.com
                            </Text>
                        </View>
                        <View style={[CommonStyles.row, { 
                            justifyContent: 'space-between', 
                            paddingVertical: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: '#334155'
                        }]}>
                            <Text style={[
                                CommonStyles.bodyText, 
                                { 
                                    color: COLORS.TEXT_SECONDARY, 
                                    fontSize: 16,
                                    fontWeight: '600'
                                }
                            ]}>
                                Phone:
                            </Text>
                            <Text style={[
                                CommonStyles.bodyText, 
                                { 
                                    color: COLORS.TEXT_LIGHT, 
                                    fontSize: 16,
                                    fontWeight: '700'
                                }
                            ]}>
                                +251-908-173-333
                            </Text>
                        </View>
                        <View style={[CommonStyles.row, { 
                            justifyContent: 'space-between', 
                            paddingVertical: 10
                        }]}>
                            <Text style={[
                                CommonStyles.bodyText, 
                                { 
                                    color: COLORS.TEXT_SECONDARY, 
                                    fontSize: 16,
                                    fontWeight: '600'
                                }
                            ]}>
                                Location:
                            </Text>
                            <Text style={[
                                CommonStyles.bodyText, 
                                { 
                                    color: COLORS.TEXT_LIGHT, 
                                    fontSize: 16,
                                    fontWeight: '700'
                                }
                            ]}>
                                Jijiga, Ethiopia
                            </Text>
                        </View>
                    </Animated.View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}
