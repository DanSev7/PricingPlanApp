import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, TextInput, Modal, View, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { initializePayment } from '@/services/paymentService';
import { WebView } from 'react-native-webview';

export default function PricingScreen() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<{title: string, amount: number} | null>(null);
  const [paymentData, setPaymentData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = (plan: {title: string, amount: number}) => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPlan) return;
    
    if (!paymentData.email || !paymentData.firstName || !paymentData.lastName) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await initializePayment({
        amount: selectedPlan.amount,
        email: paymentData.email,
        firstName: paymentData.firstName,
        lastName: paymentData.lastName,
        plan: selectedPlan.title,
      });

      if (response.success) {
        // Show Chapa checkout in WebView
        if (response.data.checkout_url) {
          setWebViewUrl(response.data.checkout_url);
          setShowPaymentForm(false);
          setShowWebView(true);
          resetPaymentForm();
        } else {
          Alert.alert('Payment Error', 'Failed to get checkout URL');
        }
      } else {
        Alert.alert('Payment Error', response.error || 'Failed to initialize payment');
      }
    } catch (error) {
      Alert.alert('Payment Error', (error as Error).message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPaymentForm = () => {
    setPaymentData({
      email: '',
      firstName: '',
      lastName: '',
    });
    setSelectedPlan(null);
  };

  const closePaymentForm = () => {
    setShowPaymentForm(false);
    resetPaymentForm();
  };

  const closeWebView = () => {
    setShowWebView(false);
    setWebViewUrl('');
  };

  // Handle messages from WebView
  const handleWebViewMessage = (event: any) => {
    try {
      const data = event.nativeEvent.data;
      console.log('Received message from WebView:', data);
      
      if (data === 'PAYMENT_SUCCESS') {
        // Close the WebView and show success popup
        closeWebView();
        setShowSuccessPopup(true);
        
        // Automatically close the success popup after 3 seconds and navigate to home
        setTimeout(() => {
          setShowSuccessPopup(false);
          // Navigate to home screen (you might need to adjust this based on your navigation setup)
          // For now, we'll just close the popup
        }, 3000);
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  // Handle WebView navigation state changes
  const handleWebViewNavigationStateChange = (navState: any) => {
    // Check if we've reached the close-webview page
    if (navState.url && navState.url.includes('/close-webview')) {
      console.log('Detected close-webview page, sending success message');
      // Close the WebView and show success popup
      closeWebView();
      setShowSuccessPopup(true);
      
      // Automatically close the success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Choose Your Plan
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Get unlimited access to all our premium features
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.plansContainer}>
          <View style={styles.planCard}>
            <ThemedText type="subtitle" style={styles.planTitle}>Basic</ThemedText>
            <View style={styles.priceContainer}>
              <ThemedText style={styles.planPrice}>$9</ThemedText>
              <ThemedText style={styles.perMonth}>/month</ThemedText>
            </View>
            <TouchableOpacity 
              style={[styles.planButton, styles.basicButton]} 
              onPress={() => handleSelectPlan({title: 'Basic', amount: 9})}
            >
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            </TouchableOpacity>
            <View style={styles.featuresList}>
              <ThemedText style={styles.featureItem}>✓ Up to 5 projects</ThemedText>
              <ThemedText style={styles.featureItem}>✓ Basic analytics</ThemedText>
              <ThemedText style={styles.featureItem}>✓ Email support</ThemedText>
              <ThemedText style={styles.featureItem}>✓ 1GB storage</ThemedText>
            </View>
          </View>

          <View style={[styles.planCard, styles.popularCard]}>
            <View style={styles.popularBadge}>
              <ThemedText style={styles.popularText}>MOST POPULAR</ThemedText>
            </View>
            <ThemedText type="subtitle" style={styles.planTitle}>Pro</ThemedText>
            <View style={styles.priceContainer}>
              <ThemedText style={styles.planPrice}>$19</ThemedText>
              <ThemedText style={styles.perMonth}>/month</ThemedText>
            </View>
            <TouchableOpacity 
              style={[styles.planButton, styles.proButton]} 
              onPress={() => handleSelectPlan({title: 'Pro', amount: 19})}
            >
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            </TouchableOpacity>
            <View style={styles.featuresList}>
              <ThemedText style={styles.featureItem}>✓ Unlimited projects</ThemedText>
              <ThemedText style={styles.featureItem}>✓ Advanced analytics</ThemedText>
              <ThemedText style={styles.featureItem}>✓ Priority email support</ThemedText>
              <ThemedText style={styles.featureItem}>✓ 10GB storage</ThemedText>
              <ThemedText style={styles.featureItem}>✓ Custom domains</ThemedText>
              <ThemedText style={styles.featureItem}>✓ API access</ThemedText>
            </View>
          </View>

          <View style={styles.planCard}>
            <ThemedText type="subtitle" style={styles.planTitle}>Enterprise</ThemedText>
            <View style={styles.priceContainer}>
              <ThemedText style={styles.planPrice}>$49</ThemedText>
              <ThemedText style={styles.perMonth}>/month</ThemedText>
            </View>
            <TouchableOpacity 
              style={[styles.planButton, styles.enterpriseButton]} 
              onPress={() => handleSelectPlan({title: 'Enterprise', amount: 49})}
            >
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            </TouchableOpacity>
            <View style={styles.featuresList}>
              <ThemedText style={styles.featureItem}>✓ Unlimited projects</ThemedText>
              <ThemedText style={styles.featureItem}>✓ Advanced analytics</ThemedText>
              <ThemedText style={styles.featureItem}>✓ 24/7 phone & email support</ThemedText>
              <ThemedText style={styles.featureItem}>✓ 100GB storage</ThemedText>
              <ThemedText style={styles.featureItem}>✓ Custom domains</ThemedText>
              <ThemedText style={styles.featureItem}>✓ API access</ThemedText>
              <ThemedText style={styles.featureItem}>✓ Team accounts (up to 10)</ThemedText>
              <ThemedText style={styles.featureItem}>✓ SSO integration</ThemedText>
            </View>
          </View>
        </ThemedView>
      </ScrollView>

      {/* Payment Form Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPaymentForm}
        onRequestClose={closePaymentForm}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              Payment Details
            </ThemedText>
            
            {selectedPlan && (
              <ThemedText style={styles.planInfo}>
                {selectedPlan.title} Plan - ${selectedPlan.amount}/month
              </ThemedText>
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={paymentData.email}
              onChangeText={(text) => setPaymentData({...paymentData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={paymentData.firstName}
              onChangeText={(text) => setPaymentData({...paymentData, firstName: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={paymentData.lastName}
              onChangeText={(text) => setPaymentData({...paymentData, lastName: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={closePaymentForm} disabled={isLoading}>
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handlePaymentSubmit} disabled={isLoading}>
                <ThemedText style={styles.buttonText}>
                  {isLoading ? 'Processing...' : 'Pay Now'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Chapa Checkout WebView */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showWebView}
        onRequestClose={closeWebView}>
        <View style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
              <ThemedText style={styles.closeButtonText}>×</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.webViewTitle}>Complete Payment</ThemedText>
          </View>
          <WebView
            source={{ uri: webViewUrl }}
            style={styles.webView}
            onMessage={handleWebViewMessage}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      </Modal>

      {/* Payment Success Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessPopup}
        onRequestClose={() => setShowSuccessPopup(false)}>
        <View style={styles.popupOverlay}>
          <View style={styles.popupContent}>
            <ThemedText style={styles.successIcon}>✓</ThemedText>
            <ThemedText type="title" style={styles.popupTitle}>Payment Successful!</ThemedText>
            <ThemedText style={styles.popupMessage}>
              Thank you for your purchase. Your {selectedPlan?.title} plan is now active.
            </ThemedText>
            <ThemedText style={styles.popupSubMessage}>
              Returning to home screen...
            </ThemedText>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  plansContainer: {
    padding: 16,
    gap: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  popularCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginVertical: 16,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  perMonth: {
    fontSize: 16,
    fontWeight: 'normal',
    marginLeft: 4,
    opacity: 0.7,
  },
  planButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  basicButton: {
    backgroundColor: '#2196F3',
  },
  proButton: {
    backgroundColor: '#4CAF50',
  },
  enterpriseButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresList: {
    marginTop: 16,
  },
  featureItem: {
    paddingVertical: 8,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  planInfo: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    marginLeft: 8,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
    marginRight: 16,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
  },
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  popupContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 350,
  },
  successIcon: {
    fontSize: 64,
    color: '#4CAF50',
    marginBottom: 16,
  },
  popupTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  popupMessage: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  popupSubMessage: {
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
});