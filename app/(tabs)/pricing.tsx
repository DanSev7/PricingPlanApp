// screens/PricingScreen.tsx (Adjusted and Unified Pricing Page - FINAL FIX WITH FREQUENCY)
import { PrimaryButton } from '@/components/primary-button'; // Import PrimaryButton
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CommonStyles from '../../constants/commonStyles'; // Import CommonStyles
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { initializePayment } from '../../services/paymentService'; // Import payment service
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Color & Dimension Constants ---
const BG_COLOR = '#0f172b'; // BG color
const CARD_COLOR = '#1d293b'; // Card color
const TINT_COLOR = '#09b6d4'; // Button/CTA color
const TEXT_COLOR = '#ffffff'; // Text color
const SECONDARY_TINT = '#2dd4bf'; // A secondary teal/cyan for checks/badges
const INPUT_BG_COLOR = '#2d394b'; // Input background color

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85; // Increased from 0.8 to 0.85 for better visibility
const CARD_MARGIN_HORIZONTAL = 15; // Increased from 10 for better spacing

// Define types for checkbox states
type PlanId = 'basic' | 'second' | 'third';
type CheckboxState = {
    mobileApp: boolean;
    extendedSupport: boolean;
};
type CheckboxStates = Record<PlanId, CheckboxState>;

export default function PricingScreen() {
    const router = useRouter();
    const [isYearly, setIsYearly] = useState(false); // Default to monthly
    const [currentIndex, setCurrentIndex] = useState(0); // Track current card index
    // State for checkbox selections for each plan
    const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>({
        basic: { mobileApp: false, extendedSupport: false },
        second: { mobileApp: false, extendedSupport: false },
        third: { mobileApp: false, extendedSupport: false }
    });
    // State for customer info
    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    // State for selected plan
    const [selectedPlan, setSelectedPlan] = useState<{id: PlanId, title: string} | null>(null);
    // State for showing customer info modal
    const [showCustomerInfo, setShowCustomerInfo] = useState(false);
    // State for showing success popup
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Check for payment status when component mounts
    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                const paymentStatus = await AsyncStorage.getItem('paymentStatus');
                if (paymentStatus === 'success') {
                    // Show success popup
                    setShowSuccessPopup(true);
                    // Automatically hide the popup after 3 seconds
                    setTimeout(() => {
                        setShowSuccessPopup(false);
                    }, 3000);
                    // Clear the payment status
                    await AsyncStorage.removeItem('paymentStatus');
                }
            } catch (error) {
                console.log('Error checking payment status:', error);
            }
        };
        
        checkPaymentStatus();
    }, []);

    const subscriptionPlans: Array<{
        id: PlanId;
        title: string;
        price: number;
        description: string;
        features: string[];
        icon: string;
        isPopular: boolean;
        ctaLabel: string;
    }> = [
        {
            id: 'basic',
            title: 'Basic Plan',
            price: 12500,
            description: 'Perfect for individuals and small projects.',
            features: [
                '1 Year Free Domain',
                'Unlimited Email Accounts',
                'Unlimited Database',
                // 'Mobile Application Not Included',
                '1 Backup/Day',
                '21 Days Retention Period',
                '1 Month Standard Support',
            ],
            icon: 'person',
            isPopular: false,
            ctaLabel: 'Get Started',
        },
        {
            id: 'second',
            title: 'Second Tier',
            price: 25000,
            description: 'Best for growing businesses.',
            features: [
                '1 Year Free Domain',
                'Unlimited Email Accounts',
                'One Database',
                // 'Mobile Application Included',
                '2 Backups/Day',
                '21 Days Retention Period',
                '2 Months Standard Support',
            ],
            icon: 'briefcase',
            isPopular: true,
            ctaLabel: 'Get Started',
        },
        {
            id: 'third',
            title: 'Third Tier',
            price: 35000,
            description: 'For large organizations needing premium solutions.',
            features: [
                '1 Year Free Domain',
                'Unlimited Email Accounts',
                'Unlimited Database',
                // 'Mobile Application Included',
                '6 Backups/Day',
                '90 Days Retention Period',
                '3 Months Standard Support',
            ],
            icon: 'business',
            isPopular: false,
            ctaLabel: 'Get Started',
        },
    ];    // Function to toggle checkbox state
    const toggleCheckbox = (planId: PlanId, feature: keyof CheckboxState) => {
        setCheckboxStates(prev => ({
            ...prev,
            [planId]: {
                ...prev[planId],
                [feature]: !prev[planId][feature]
            }
        }));
    };
    // Function to calculate total price with addons
    const calculateTotalPrice = (planId: PlanId, basePrice: number) => {
        const addons = checkboxStates[planId];
        let total = basePrice;
        
        if (addons.mobileApp) total += 10000;
        if (addons.extendedSupport) total += 5000;
        
        return total;
    };

    // Function to handle subscription button press
    const handleSubscribePress = (planId: PlanId, planTitle: string) => {
        setSelectedPlan({id: planId, title: planTitle});
        setShowCustomerInfo(true);
    };

    // Function to handle actual subscription after customer info is entered
    const handleSubscribe = async () => {
        // Validate customer info
        if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
            Alert.alert('Missing Information', 'Please fill in all customer information fields.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerInfo.email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        if (!selectedPlan) return;

        // Find the selected plan
        const plan = subscriptionPlans.find(plan => plan.id === selectedPlan.id);
        if (!plan) return;

        // Calculate total price
        const totalPrice = calculateTotalPrice(selectedPlan.id, plan.price);

        try {
            // Initialize payment with backend using the new payment service
            const response = await initializePayment({
                email: customerInfo.email,
                firstName: customerInfo.firstName,
                lastName: customerInfo.lastName,
                amount: totalPrice,
                plan: selectedPlan.title // Changed from planId to plan and using title instead of id
                // Removed addons as it's not expected by the payment service
            });

            // Check if response has the expected structure
            if (response.success && response.data && response.data.checkout_url) {
                // Close modal and navigate to payment WebView
                setShowCustomerInfo(false);
                // Reset form
                setCustomerInfo({
                    firstName: '',
                    lastName: '',
                    email: ''
                });
                // Navigate to WebView with checkout URL
                router.push({
                    pathname: '/(tabs)/payment-webview',
                    params: { url: response.data.checkout_url }
                });
            } else {
                Alert.alert('Payment Error', response.error || 'Failed to initialize payment');
            }
        } catch (error) {
            console.error('Payment initialization error:', error);
            Alert.alert('Network Error', 'Failed to connect to payment service. Please check your network connection and try again.');
        }
    };

    // Handle scroll event to track current index
    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_MARGIN_HORIZONTAL * 2));
        setCurrentIndex(index);
    };

    // Calculate snap interval: Card width + margin on the left + margin on the right
    const snapInterval = CARD_WIDTH + (CARD_MARGIN_HORIZONTAL * 2);

    return (
        <ThemedView style={[styles.container, { backgroundColor: BG_COLOR }]}>
            {/* Back Button - Updated to match team detail screen style */}
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={26} color={TINT_COLOR} />
            </TouchableOpacity>
            
            {/* Custom Screen Header with reduced padding */}
            <Animated.View 
                entering={FadeInUp.duration(700)} 
                style={{ 
                    paddingHorizontal: 20, 
                    paddingTop: 12, // Increased from 15
                    paddingBottom: 16, // Increased from 20
                    alignItems: 'center',
                    marginTop: 30, // Increased from 25
                }}
            >
                <ThemedText style={[
                    {
                        color: TINT_COLOR, 
                        fontSize: 32,
                        fontWeight: '900',
                        textAlign: 'center',
                        marginBottom: 10,
                        lineHeight: 36, // Added line height to prevent clipping
                    }
                ]}>
                    Subscription Plans
                </ThemedText>
                
                <ThemedText style={[
                    {
                        color: TEXT_COLOR + 'b3', 
                        fontSize: 16,
                        textAlign: 'center',
                        lineHeight: 24,
                        marginBottom: 12,
                    }
                ]}>
                    Choose the plan that suits your needs.
                </ThemedText>
                
                <View style={{ 
                    width: 80, 
                    height: 4, 
                    backgroundColor: TINT_COLOR, 
                    borderRadius: 2, 
                    opacity: 0.8
                }} />
            </Animated.View>

            {/* Horizontal Scrollable Pricing Cards */}
            <View style={styles.horizontalScrollContainer}>
                <ScrollView 
                    horizontal 
                    pagingEnabled 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalContent}
                    decelerationRate="fast"
                    snapToInterval={snapInterval}
                    snapToAlignment="center" // Changed from start to center for better alignment
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {subscriptionPlans.map((plan) => (
                        <View 
                            key={plan.id}
                            style={[
                                styles.card,
                                CommonStyles.card, // Add custom card style
                                plan.isPopular && styles.popularCard,
                                { 
                                    backgroundColor: CARD_COLOR,
                                    borderColor: plan.isPopular ? TINT_COLOR : CARD_COLOR,
                                    position: 'relative', // Add relative positioning for absolute children
                                }
                            ]}
                        >
                            <View style={styles.cardInnerContent}>
                                {plan.isPopular && (
                                    <View style={[styles.popularBadge, { backgroundColor: SECONDARY_TINT }]}>
                                        <ThemedText style={[styles.popularText, { color: BG_COLOR }]}>Most Popular</ThemedText>
                                    </View>
                                )}
                                
                                <View style={[styles.cardHeader, plan.isPopular && { marginTop: 20 }]}>
                                    <Ionicons name={plan.icon as any} size={32} color={TINT_COLOR} style={styles.planIcon} />
                                    <ThemedText type="subtitle" style={[styles.planTitle, { color: TEXT_COLOR }]}>
                                        {plan.title}
                                    </ThemedText>
                                    <ThemedText style={[styles.planDescription, { color: TEXT_COLOR + 'b3' }]}>
                                        {plan.description}
                                    </ThemedText>
                                </View>
                                
                                <View style={styles.priceContainer}>
                                    <ThemedText style={[styles.price, { color: TEXT_COLOR }]}>
                                        ETB {calculateTotalPrice(plan.id, plan.price).toLocaleString('en-US')}
                                    </ThemedText>
                                </View>
                                
                                <View style={styles.featuresContainer}>
                                    {plan.features.map((feature, index) => {
                                        // Check if this is the "Mobile Application Not Included" feature
                                        const isNotIncluded = feature === 'Mobile Application Not Included';
                                        
                                        return (
                                            <View key={index} style={styles.featureRow}>
                                                <Ionicons 
                                                    name={isNotIncluded ? "close-circle" : "checkmark-circle"} 
                                                    size={20} 
                                                    color={isNotIncluded ? "#ff6b6b" : SECONDARY_TINT} 
                                                    style={styles.checkIcon} 
                                                />
                                                <ThemedText 
                                                    style={[
                                                        styles.featureText, 
                                                        { 
                                                            color: TEXT_COLOR,
                                                            opacity: isNotIncluded ? 0.7 : 1 // Reduce opacity for not included features
                                                        }
                                                    ]}
                                                >
                                                    {feature}
                                                </ThemedText>
                                            </View>
                                        );
                                    })}
                                </View>
                                
                                {/* Additional Options with Checkboxes */}
                                <View style={styles.addonsContainer}>
                                    <TouchableOpacity 
                                        style={styles.addonRow}
                                        onPress={() => toggleCheckbox(plan.id, 'mobileApp')}
                                    >
                                        <Ionicons 
                                            name={checkboxStates[plan.id].mobileApp ? "checkbox" : "square-outline"} 
                                            size={20} 
                                            color={TINT_COLOR} 
                                            style={styles.checkbox} 
                                        />
                                        <ThemedText style={[styles.addonText, { color: TEXT_COLOR }]}>
                                            Mobile App (+10,000 ETB)
                                        </ThemedText>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        style={styles.addonRow}
                                        onPress={() => toggleCheckbox(plan.id, 'extendedSupport')}
                                    >
                                        <Ionicons 
                                            name={checkboxStates[plan.id].extendedSupport ? "checkbox" : "square-outline"} 
                                            size={20} 
                                            color={TINT_COLOR} 
                                            style={styles.checkbox} 
                                        />
                                        <ThemedText style={[styles.addonText, { color: TEXT_COLOR }]}>
                                            Extended Support (+5,000 ETB)
                                        </ThemedText>
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={styles.buttonContainer}>
                                    <PrimaryButton 
                                        title={plan.ctaLabel}
                                        onPress={() => handleSubscribePress(plan.id, plan.title)}
                                        style={styles.subscribeButton}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            
        

            {/* Customer Information Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showCustomerInfo}
                onRequestClose={() => setShowCustomerInfo(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <ThemedText style={styles.modalTitle}>Customer Information</ThemedText>
                            <TouchableOpacity 
                                onPress={() => setShowCustomerInfo(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color={TEXT_COLOR} />
                            </TouchableOpacity>
                        </View>
                        
                        {selectedPlan && (
                            <ThemedText style={styles.selectedPlanText}>
                                Selected Plan: {selectedPlan.title}
                            </ThemedText>
                        )}
                        
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                placeholderTextColor={TEXT_COLOR + '80'}
                                value={customerInfo.firstName}
                                onChangeText={(text) => setCustomerInfo({...customerInfo, firstName: text})}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                placeholderTextColor={TEXT_COLOR + '80'}
                                value={customerInfo.lastName}
                                onChangeText={(text) => setCustomerInfo({...customerInfo, lastName: text})}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor={TEXT_COLOR + '80'}
                                value={customerInfo.email}
                                onChangeText={(text) => setCustomerInfo({...customerInfo, email: text})}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        
                        <PrimaryButton 
                            title="Proceed to Payment"
                            onPress={handleSubscribe}
                            style={styles.modalButton}
                        />
                    </View>
                </View>
            </Modal>

            {/* Success Popup */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showSuccessPopup}
                statusBarTranslucent={true}
            >
                <View style={styles.popupOverlay}>
                    <View style={styles.popupContainer}>
                        <View style={styles.popupIcon}>
                            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
                        </View>
                        <ThemedText style={styles.popupTitle}>Payment Successful!</ThemedText>
                        <ThemedText style={styles.popupMessage}>Thank you for your purchase. Your subscription is now active.</ThemedText>
                        <TouchableOpacity 
                            style={styles.popupButton}
                            onPress={() => setShowSuccessPopup(false)}
                        >
                            <ThemedText style={styles.popupButtonText}>Continue</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20, // Increased from 15
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 10,
        backgroundColor: 'rgba(15, 23, 43, 0.5)', // Reduced opacity to 0.5
        borderRadius: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 6,
    },
    horizontalScrollContainer: {
        flex: 1,
        paddingTop: 5,
        marginTop: 10, // Increased from 10 to balance spacing
    },
    horizontalContent: {
        paddingHorizontal: CARD_MARGIN_HORIZONTAL,
        paddingVertical: 20,
    },
    card: {
        width: CARD_WIDTH,
        marginHorizontal: CARD_MARGIN_HORIZONTAL,
        borderRadius: 20,
        borderWidth: 2,
        overflow: 'visible',
        minHeight: 550, // Increased from 500 to ensure button visibility
    },
    popularCard: {
        transform: [{ scale: 1.02 }], // Reduced from 1.05
        zIndex: 1,
    },
    cardInnerContent: {
        flex: 1,
        padding: 20,
    },
    popularBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12, // Reduced from 16 to optimize space
        position: 'absolute',
        top: -10,
        right: 20,
        zIndex: 1,
    },
    popularText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: BG_COLOR, // Ensure proper color contrast
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 12, // Reduced from 16 to optimize space
    },
    planIcon: {
        marginBottom: 8, // Decreased from 12
    },
    planTitle: {
        fontSize: 22, // Decreased from 24
        fontWeight: '700',
        marginBottom: 8,
    },
    planDescription: {
        fontSize: 13, // Decreased from 14
        textAlign: 'center',
        lineHeight: 18, // Reduced from 20 to optimize space
        opacity: 0.8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        marginBottom: 12, // Reduced from 16 to optimize space
    },
    price: {
        fontSize: 28, // Decreased from 32
        fontWeight: '800',
    },
    featuresContainer: {
        marginBottom: 15, // Reduced from 20 to optimize space
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6, // Reduced from 8 to optimize space
    },
    checkIcon: {
        marginRight: 12,
    },
    featureText: {
        fontSize: 14, // Decreased from 16 for better fit
        flex: 1,
    },
    addonsContainer: {
        marginVertical: 15,
        paddingHorizontal: 5,
    },
    addonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        marginRight: 12,
    },
    addonText: {
        fontSize: 14,
        flex: 1,
    },
    buttonContainer: {
        marginTop: 'auto',
        marginBottom: 10,
        minHeight: 50, // Ensure minimum height for the button
    },
    subscribeButton: {
        width: '100%',
        minHeight: 45, // Ensure minimum height for the button
    },
    infoSection: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 10,
    },
    infoText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: CARD_COLOR,
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 500,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: TEXT_COLOR,
    },
    closeButton: {
        padding: 5,
    },
    selectedPlanText: {
        fontSize: 16,
        color: TEXT_COLOR,
        marginBottom: 20,
        textAlign: 'center',
        opacity: 0.8,
    },
    inputGroup: {
        gap: 15,
        marginBottom: 20,
    },
    input: {
        height: 50,
        backgroundColor: INPUT_BG_COLOR,
        borderRadius: 10,
        paddingHorizontal: 15,
        color: TEXT_COLOR,
        fontSize: 16,
    },
    modalButton: {
        width: '100%',
    },
    // Popup Styles
    popupOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 43, 0.8)', // BG_COLOR with opacity
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        backgroundColor: '#1d293b', // CARD_COLOR
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        margin: 20,
        maxWidth: 300,
        borderWidth: 2,
        borderColor: '#09b6d4', // TINT_COLOR
    },
    popupIcon: {
        marginBottom: 16,
    },
    popupTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff', // TEXT_COLOR
        marginBottom: 8,
        textAlign: 'center',
    },
    popupMessage: {
        fontSize: 16,
        color: '#ffffff', // TEXT_COLOR
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    popupButton: {
        backgroundColor: '#09b6d4', // TINT_COLOR
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 120,
    },
    popupButtonText: {
        color: '#ffffff', // TEXT_COLOR
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});
