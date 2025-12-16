import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentWebView() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { url } = params;

  if (!url) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.errorText}>Invalid payment URL</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    );
  }

  const handleMessage = (event: any) => {
    if (event.nativeEvent.data === 'PAYMENT_SUCCESS') {
      // Set a flag in AsyncStorage to indicate successful payment
      AsyncStorage.setItem('paymentStatus', 'success');
      // Close the WebView and navigate back to pricing screen
      router.replace('/(tabs)/pricing');
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complete Payment</Text>
        </View>
        <WebView
          source={{ uri: url as string }}
          style={styles.webview}
          onLoadStart={() => console.log('Loading payment page...')}
          onLoadEnd={() => console.log('Payment page loaded')}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#0f172b', // BG_COLOR
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#09b6d4', // TINT_COLOR
    backgroundColor: '#1d293b', // CARD_COLOR
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // TEXT_COLOR
  },
  webview: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
    color: '#ffffff', // TEXT_COLOR
  },
  button: {
    backgroundColor: '#09b6d4', // TINT_COLOR
    padding: 12,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: '#ffffff', // TEXT_COLOR
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
