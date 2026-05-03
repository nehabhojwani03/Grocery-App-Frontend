import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../../store/slices/authSlice';
import { setUserData } from '../../store/slices/userSlice';
import notificationService from '../../services/notificationService';

// ─── Role → screen mapping ───────────────────────────────────────────────────
// FIX: After signup, navigate to the correct home screen for the role.
const ROLE_HOME_SCREEN = {
  admin:  'AdminHome',
  driver: 'DriverHome',
  user:   'MainApp',
};

// ─── Role Option Card ────────────────────────────────────────────────────────
const RoleCard = ({ role, selectedRole, onSelect }) => {
  const isSelected = selectedRole === role.id;
  return (
    <TouchableOpacity
      style={[styles.roleCard, isSelected && styles.roleCardSelected]}
      onPress={() => onSelect(role.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.roleEmoji}>{role.emoji}</Text>
      <Text style={[styles.roleTitle, isSelected && styles.roleTitleSelected]}>
        {role.title}
      </Text>
      <Text style={[styles.roleDesc, isSelected && styles.roleDescSelected]}>
        {role.desc}
      </Text>
      <View style={[styles.roleDot, isSelected && styles.roleDotSelected]} />
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const SignupScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [selectedRole, setSelectedRole] = useState('user');
  const [name, setName]                           = useState('');
  const [email, setEmail]                         = useState('');
  const [phone, setPhone]                         = useState('');
  const [password, setPassword]                   = useState('');
  const [confirmPassword, setConfirmPassword]     = useState('');
  const [showPassword, setShowPassword]           = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Driver-specific fields
  const [vehicleType, setVehicleType]       = useState('bike');
  const [vehicleNumber, setVehicleNumber]   = useState('');
  const [licenseNumber, setLicenseNumber]   = useState('');

  // Focus states
  const [nameFocused, setNameFocused]                     = useState(false);
  const [emailFocused, setEmailFocused]                   = useState(false);
  const [phoneFocused, setPhoneFocused]                   = useState(false);
  const [passwordFocused, setPasswordFocused]             = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [vehicleNumberFocused, setVehicleNumberFocused]   = useState(false);
  const [licenseNumberFocused, setLicenseNumberFocused]   = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Signup Failed', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const roles = [
    { id: 'user',   emoji: '🛒', title: 'Customer',        desc: 'Shop & order groceries'    },
    { id: 'driver', emoji: '🚗', title: 'Delivery Rider',  desc: 'Deliver & earn money'      },
  ];

  const vehicleTypes = [
    { id: 'bike',    label: '🏍️ Bike'   },
    { id: 'scooter', label: '🛵 Scooter' },
    { id: 'car',     label: '🚗 Car'     },
    { id: 'van',     label: '🚐 Van'     },
  ];

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePhone = (val) => /^[0-9]{10}$/.test(val);

  const handleSignup = async () => {
    // ── Validation ────────────────────────────────────────────────────────────
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (name.trim().length < 3) {
      Alert.alert('Error', 'Name must be at least 3 characters');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (selectedRole === 'driver') {
      if (!vehicleNumber.trim()) {
        Alert.alert('Error', 'Please enter your vehicle number');
        return;
      }
      if (!licenseNumber.trim()) {
        Alert.alert('Error', 'Please enter your license number');
        return;
      }
    }

    try {
      const permissionGranted = await notificationService.requestPermission();
      let fcmToken = null;
      if (permissionGranted) {
        fcmToken = await notificationService.getToken();
      }

      // FIX: Driver fields (vehicleType, vehicleNumber, licenseNumber) are now
      // passed to signupUser which forwards them as the 7th argument to
      // authService.signup(), where they are spread into the request body.
      // Previously these fields were lost before reaching the API.
      const result = await dispatch(signupUser({
        name:          name.trim(),
        email:         email.trim().toLowerCase(),
        password,
        phone:         phone.trim(),
        role:          selectedRole,
        fcmToken,
        vehicleType,
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        licenseNumber: licenseNumber.trim().toUpperCase(),
      })).unwrap();

      if (result.user) {
        dispatch(setUserData(result.user));
      }

      // FIX: Navigate to the correct home screen based on the user's role.
      const role       = result.user?.role ?? selectedRole;
      const homeScreen = ROLE_HOME_SCREEN[role] ?? 'MainApp';

      const successTitle = role === 'driver' ? 'Welcome, Rider! 🚗' : 'Welcome! 🎉';
      const successMsg   = role === 'driver'
        ? 'Driver account created! Go online to start accepting deliveries.'
        : 'Account created!\n\nCheck your notifications for a special welcome offer!';

      Alert.alert(successTitle, successMsg, [
        {
          text: "Let's Go!",
          onPress: () => navigation.replace(homeScreen),
        },
      ]);

    } catch (err) {
      // Errors handled by the useEffect above via Redux error state.
      console.error('Signup error:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            disabled={loading}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>
                {selectedRole === 'driver' ? '🚗' : '🛒'}
              </Text>
            </View>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Choose how you want to join us</Text>
        </View>

        <View style={styles.formContainer}>

          {/* ── Role Selector ──────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>I want to join as</Text>
          <View style={styles.roleRow}>
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
              />
            ))}
          </View>

          {/* ── Common Fields ──────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>Personal Details</Text>

          {/* Name */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputContainer, nameFocused && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, emailFocused && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputContainer, phoneFocused && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password (min. 6 chars)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                disabled={loading}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputContainer, confirmPasswordFocused && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>🔐</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
                disabled={loading}
              >
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Password strength hints */}
          <View style={styles.requirementsContainer}>
            <View style={styles.requirementItem}>
              <Text style={password.length >= 6 ? styles.checkValid : styles.checkInvalid}>
                {password.length >= 6 ? '✓' : '○'}
              </Text>
              <Text style={styles.requirementText}>At least 6 characters</Text>
            </View>
            <View style={styles.requirementItem}>
              <Text style={password && password === confirmPassword ? styles.checkValid : styles.checkInvalid}>
                {password && password === confirmPassword ? '✓' : '○'}
              </Text>
              <Text style={styles.requirementText}>Passwords match</Text>
            </View>
          </View>

          {/* ── Driver-Only Fields ─────────────────────────────────── */}
          {selectedRole === 'driver' && (
            <View style={styles.driverSection}>
              <View style={styles.driverSectionHeader}>
                <Text style={styles.driverSectionTitle}>🚗 Vehicle Details</Text>
                <Text style={styles.driverSectionSubtitle}>Required for delivery approval</Text>
              </View>

              {/* Vehicle Type Selector */}
              <Text style={styles.label}>Vehicle Type</Text>
              <View style={styles.vehicleTypeRow}>
                {vehicleTypes.map((v) => (
                  <TouchableOpacity
                    key={v.id}
                    style={[
                      styles.vehicleChip,
                      vehicleType === v.id && styles.vehicleChipSelected,
                    ]}
                    onPress={() => setVehicleType(v.id)}
                    disabled={loading}
                  >
                    <Text style={[
                      styles.vehicleChipText,
                      vehicleType === v.id && styles.vehicleChipTextSelected,
                    ]}>
                      {v.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Vehicle Number */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Vehicle Number</Text>
                <View style={[styles.inputContainer, vehicleNumberFocused && styles.inputContainerFocused]}>
                  <Text style={styles.inputIcon}>🔢</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. RJ14 AB 1234"
                    value={vehicleNumber}
                    onChangeText={setVehicleNumber}
                    autoCapitalize="characters"
                    onFocus={() => setVehicleNumberFocused(true)}
                    onBlur={() => setVehicleNumberFocused(false)}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* License Number */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Driving License Number</Text>
                <View style={[styles.inputContainer, licenseNumberFocused && styles.inputContainerFocused]}>
                  <Text style={styles.inputIcon}>📋</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. RJ-1420200012345"
                    value={licenseNumber}
                    onChangeText={setLicenseNumber}
                    autoCapitalize="characters"
                    onFocus={() => setLicenseNumberFocused(true)}
                    onBlur={() => setLicenseNumberFocused(false)}
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.driverNote}>
                <Text style={styles.driverNoteText}>
                  ℹ️ Driver accounts require admin approval before you can start accepting deliveries.
                </Text>
              </View>
            </View>
          )}

          {/* Terms */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.signupButton, loading && styles.disabledButton]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color="#fff" />
                <Text style={[styles.signupButtonText, { marginLeft: 10 }]}>
                  Creating Account...
                </Text>
              </View>
            ) : (
              <Text style={styles.signupButtonText}>
                {selectedRole === 'driver' ? '🚗 Register as Rider' : '🛒 Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} disabled={loading}>
              <Text style={styles.socialIcon}>📘</Text>
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} disabled={loading}>
              <Text style={styles.socialIcon}>🔴</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1 },

  // Header
  headerContainer: {
    paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  backIcon: { fontSize: 24, color: '#2c3e50' },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  logo: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  logoIcon: { fontSize: 35 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#7f8c8d', textAlign: 'center' },

  // Form
  formContainer: { padding: 24 },
  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: '#94a3b8',
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12, marginTop: 4,
  },

  // Role Cards
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleCard: {
    flex: 1, borderWidth: 2, borderColor: '#e0e0e0',
    borderRadius: 16, padding: 16, alignItems: 'center',
    backgroundColor: '#f8f9fa', position: 'relative',
  },
  roleCardSelected: { borderColor: '#4CAF50', backgroundColor: '#f0fdf4' },
  roleEmoji: { fontSize: 28, marginBottom: 8 },
  roleTitle: { fontSize: 14, fontWeight: '700', color: '#2c3e50', marginBottom: 4 },
  roleTitleSelected: { color: '#16a34a' },
  roleDesc: { fontSize: 11, color: '#94a3b8', textAlign: 'center' },
  roleDescSelected: { color: '#4CAF50' },
  roleDot: {
    position: 'absolute', top: 10, right: 10,
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 2, borderColor: '#e0e0e0', backgroundColor: 'transparent',
  },
  roleDotSelected: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },

  // Inputs
  inputWrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: '#e0e0e0',
    borderRadius: 12, backgroundColor: '#f8f9fa',
    paddingHorizontal: 16, height: 54,
  },
  inputContainerFocused: { borderColor: '#4CAF50', backgroundColor: '#fff' },
  inputIcon: { fontSize: 20, marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#2c3e50' },
  eyeButton: { padding: 8 },
  eyeIcon: { fontSize: 20 },

  // Password hints
  requirementsContainer: {
    backgroundColor: '#f0f4f8', borderRadius: 12,
    padding: 12, marginBottom: 16, gap: 6,
  },
  requirementItem: { flexDirection: 'row', alignItems: 'center' },
  checkValid: { fontSize: 15, color: '#4CAF50', marginRight: 8, fontWeight: 'bold' },
  checkInvalid: { fontSize: 15, color: '#bdbdbd', marginRight: 8 },
  requirementText: { fontSize: 13, color: '#546e7a' },

  // Driver section
  driverSection: {
    backgroundColor: '#eff6ff',
    borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1.5, borderColor: '#bfdbfe',
  },
  driverSectionHeader: { marginBottom: 16 },
  driverSectionTitle: { fontSize: 15, fontWeight: '800', color: '#1e40af', marginBottom: 2 },
  driverSectionSubtitle: { fontSize: 12, color: '#3b82f6' },
  vehicleTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  vehicleChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#bfdbfe',
    backgroundColor: '#fff',
  },
  vehicleChipSelected: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  vehicleChipText: { fontSize: 13, color: '#2563eb', fontWeight: '600' },
  vehicleChipTextSelected: { color: '#fff' },
  driverNote: {
    backgroundColor: '#dbeafe', borderRadius: 10,
    padding: 12, marginTop: 4,
  },
  driverNoteText: { fontSize: 12, color: '#1d4ed8', lineHeight: 18 },

  // Terms
  termsContainer: { marginBottom: 20 },
  termsText: { fontSize: 13, color: '#7f8c8d', textAlign: 'center', lineHeight: 20 },
  termsLink: { color: '#4CAF50', fontWeight: '600' },

  // Submit button
  signupButton: {
    backgroundColor: '#4CAF50', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  disabledButton: { opacity: 0.6 },
  signupButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },

  // Divider
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  divider: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { marginHorizontal: 16, color: '#95a5a6', fontSize: 14, fontWeight: '600' },

  // Social
  socialContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 12 },
  socialButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#e0e0e0', borderRadius: 12,
    paddingVertical: 12, backgroundColor: '#fff',
  },
  socialIcon: { fontSize: 20, marginRight: 8 },
  socialText: { fontSize: 14, fontWeight: '600', color: '#2c3e50' },

  // Login link
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 },
  loginText: { color: '#7f8c8d', fontSize: 15 },
  loginLink: { color: '#4CAF50', fontSize: 15, fontWeight: 'bold' },
});

export default SignupScreen;