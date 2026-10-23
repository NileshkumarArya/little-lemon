import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ onOnboardingComplete }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const isValid = firstName.trim().length > 0 && email.includes('@') && email.includes('.');

  const handleNext = async () => {
    if (!isValid) return;
    try {
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          firstName: firstName.trim(),
          lastName: '',
          email: email.trim(),
          phone: '',
          notifications: {
            orderStatuses: true,
            passwordChanges: true,
            specialOffers: true,
            newsletter: true,
          },
        })
      );
      onOnboardingComplete();
    } catch (e) {
      console.log('Error saving user data:', e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoEmoji}>🍋</Text>
            <Text style={styles.logoText}>LITTLE LEMON</Text>
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>Little Lemon</Text>
            <Text style={styles.heroCity}>Chicago</Text>
            <Text style={styles.heroDesc}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
          </View>
          <View style={styles.heroImagePlaceholder}>
            <Text style={styles.heroImageEmoji}>🥗</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Let's get to know you</Text>

          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={[styles.nextButtonText, !isValid && styles.nextButtonTextDisabled]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoEmoji: {
    fontSize: 28,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 1.5,
  },
  heroBanner: {
    backgroundColor: '#495E57',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTextBlock: {
    flex: 1,
    paddingRight: 10,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F4CE14',
    lineHeight: 36,
  },
  heroCity: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  heroDesc: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  heroImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#3d4f44',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImageEmoji: {
    fontSize: 48,
  },
  formContainer: {
    padding: 24,
    flex: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495E57',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  nextButton: {
    backgroundColor: '#F4CE14',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  nextButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
});
