import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation, onLogout }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notifications, setNotifications] = useState({
    orderStatuses: true,
    passwordChanges: true,
    specialOffers: true,
    newsletter: true,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const parsed = JSON.parse(data);
        setFirstName(parsed.firstName || '');
        setLastName(parsed.lastName || '');
        setEmail(parsed.email || '');
        setPhone(parsed.phone || '');
        setNotifications(
          parsed.notifications || {
            orderStatuses: true,
            passwordChanges: true,
            specialOffers: true,
            newsletter: true,
          }
        );
        setOriginalData(parsed);
      }
    } catch (e) {
      console.log('Error loading user data:', e);
    }
  };

  const trackChange = () => setHasChanges(true);

  const handleSave = async () => {
    try {
      const updated = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notifications,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(updated));
      setOriginalData(updated);
      setHasChanges(false);
      Alert.alert('Saved!', 'Your changes have been saved.');
    } catch (e) {
      Alert.alert('Error', 'Could not save changes.');
    }
  };

  const handleDiscard = () => {
    if (originalData) {
      setFirstName(originalData.firstName || '');
      setLastName(originalData.lastName || '');
      setEmail(originalData.email || '');
      setPhone(originalData.phone || '');
      setNotifications(
        originalData.notifications || {
          orderStatuses: true,
          passwordChanges: true,
          specialOffers: true,
          newsletter: true,
        }
      );
    }
    setHasChanges(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out? All data will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userData');
              onLogout();
            } catch (e) {
              Alert.alert('Error', 'Could not log out.');
            }
          },
        },
      ]
    );
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    trackChange();
  };

  const getInitials = () => {
    const f = firstName ? firstName[0].toUpperCase() : '';
    const l = lastName ? lastName[0].toUpperCase() : '';
    return f + l || '?';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.logoRow}>
          <Text style={styles.logoEmoji}>🍋</Text>
          <Text style={styles.logoText}>LITTLE LEMON</Text>
        </View>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarSmallText}>{getInitials()}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>Personal information</Text>

        {/* Avatar */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{getInitials()}</Text>
          </View>
          <View style={styles.avatarActions}>
            <TouchableOpacity style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.fieldLabel}>First name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={v => { setFirstName(v); trackChange(); }}
            autoCapitalize="words"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.fieldLabel}>Last name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={v => { setLastName(v); trackChange(); }}
            autoCapitalize="words"
            placeholder="Enter last name"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={v => { setEmail(v); trackChange(); }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.fieldLabel}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={v => { setPhone(v); trackChange(); }}
            keyboardType="phone-pad"
            placeholder="(000) 000-0000"
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Email Notifications */}
        <Text style={styles.sectionHeading}>Email notifications</Text>
        <View style={styles.notifContainer}>
          {[
            { key: 'orderStatuses', label: 'Order statuses' },
            { key: 'passwordChanges', label: 'Password changes' },
            { key: 'specialOffers', label: 'Special offers' },
            { key: 'newsletter', label: 'Newsletter' },
          ].map(item => (
            <View key={item.key} style={styles.notifRow}>
              <View
                style={[
                  styles.checkbox,
                  notifications[item.key] && styles.checkboxChecked,
                ]}
              >
                <TouchableOpacity onPress={() => toggleNotification(item.key)}>
                  <Text style={styles.checkMark}>
                    {notifications[item.key] ? '✓' : ''}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.notifLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Log out</Text>
        </TouchableOpacity>

        {/* Save / Discard */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.discardBtn, !hasChanges && styles.btnDimmed]}
            onPress={handleDiscard}
            disabled={!hasChanges}
          >
            <Text style={styles.discardBtnText}>Discard changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, !hasChanges && styles.btnDimmed]}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Text style={styles.saveBtnText}>Save changes</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoEmoji: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 1.2,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSmallText: {
    color: '#F4CE14',
    fontWeight: '700',
    fontSize: 16,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 14,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarLargeText: {
    color: '#F4CE14',
    fontWeight: '700',
    fontSize: 26,
  },
  avatarActions: {
    flexDirection: 'row',
    gap: 10,
  },
  changeBtn: {
    backgroundColor: '#495E57',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  changeBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  removeBtn: {
    borderWidth: 1.5,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  removeBtnText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  notifContainer: {
    marginBottom: 8,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#495E57',
    borderColor: '#495E57',
  },
  checkMark: {
    color: '#F4CE14',
    fontWeight: '700',
    fontSize: 14,
  },
  notifLabel: {
    fontSize: 15,
    color: '#333',
  },
  logoutBtn: {
    backgroundColor: '#F4CE14',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  discardBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#495E57',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  discardBtnText: {
    color: '#495E57',
    fontWeight: '600',
    fontSize: 14,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#495E57',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnDimmed: {
    opacity: 0.4,
  },
});
