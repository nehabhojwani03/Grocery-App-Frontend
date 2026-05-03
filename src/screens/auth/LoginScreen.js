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
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { setUserData } from '../../store/slices/userSlice';

const { width } = Dimensions.get('window');

// ─── Admin Quick Login credentials (frontend dev helper only) ────────────────
const ADMIN_EMAIL    = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456';

// ─── Role → screen mapping ───────────────────────────────────────────────────
// FIX: After a successful login the app must navigate to the correct home
// screen based on the user's role. Previously nothing called navigation.replace()
// so every user landed on the same screen regardless of role.
const ROLE_HOME_SCREEN = {
  admin:  'AdminHome',
  driver: 'DriverHome',
  user:   'MainApp',
};

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [showPassword, setShowPassword]         = useState(false);
  const [emailFocused, setEmailFocused]         = useState(false);
  const [passwordFocused, setPasswordFocused]   = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // ── Quick-fill admin credentials ──────────────────────────────────────────
  const handleAdminQuickFill = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();

      if (result.user) {
        dispatch(setUserData(result.user));
      }

      // FIX: Navigate to the correct screen based on the user's role.
      // Use navigation.replace() so the user cannot navigate back to the
      // login screen with the hardware/gesture back button.
      const role       = result.user?.role ?? 'user';
      const homeScreen = ROLE_HOME_SCREEN[role] ?? 'MainApp';
      const userName   = result.user?.name ?? 'User';

      Alert.alert(
        'Welcome back!',
        `Signed in as ${userName}`,
        [
          {
            text: "Let's Go!",
            onPress: () => navigation.replace(homeScreen),
          },
        ]
      );
    } catch (err) {
      // Errors are handled by the useEffect above via the Redux error state.
      console.error('Login error:', err);
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
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>🛒</Text>
            </View>
          </View>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue shopping</Text>
        </View>

        <View style={styles.formContainer}>

          {/* ── Admin Quick Login Card ──────────────────────────────── */}
          <TouchableOpacity
            style={styles.adminCard}
            onPress={handleAdminQuickFill}
            activeOpacity={0.75}
            disabled={loading}
          >
            <View style={styles.adminCardLeft}>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
              <View>
                <Text style={styles.adminCardTitle}>Quick Admin Login</Text>
                <Text style={styles.adminCardSub}>{ADMIN_EMAIL}</Text>
              </View>
            </View>
            <View style={styles.adminCardArrow}>
              <Text style={styles.adminCardArrowText}>Fill →</Text>
            </View>
          </TouchableOpacity>

          {/* Email Input */}
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
              {email.length > 0 && (
                <TouchableOpacity onPress={() => setEmail('')} disabled={loading}>
                  <Text style={styles.clearBtn}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
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

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordContainer}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color="#fff" />
                <Text style={[styles.loginButtonText, { marginLeft: 10 }]}>
                  Signing In...
                </Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login */}
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

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} disabled={loading}>
              <Text style={styles.signupLink}>Sign Up</Text>
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
    paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
  },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  logoIcon: { fontSize: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#7f8c8d', textAlign: 'center' },

  // Form
  formContainer: { padding: 24 },

  // Admin Quick Login Card
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e94560',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  adminCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  adminBadge: {
    backgroundColor: '#e94560',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  adminBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  adminCardTitle: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  adminCardSub: { color: '#94a3b8', fontSize: 12 },
  adminCardArrow: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminCardArrowText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Inputs
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: '#e0e0e0',
    borderRadius: 12, backgroundColor: '#f8f9fa',
    paddingHorizontal: 16, height: 56,
  },
  inputContainerFocused: { borderColor: '#4CAF50', backgroundColor: '#fff' },
  inputIcon: { fontSize: 20, marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#2c3e50' },
  clearBtn: { fontSize: 14, color: '#94a3b8', paddingHorizontal: 4 },
  eyeButton: { padding: 8 },
  eyeIcon: { fontSize: 20 },

  // Forgot
  forgotPasswordContainer: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { color: '#4CAF50', fontSize: 14, fontWeight: '600' },

  // Login button
  loginButton: {
    backgroundColor: '#4CAF50', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  disabledButton: { opacity: 0.6 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Divider
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  divider: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { marginHorizontal: 16, color: '#95a5a6', fontSize: 14, fontWeight: '600' },

  // Social
  socialContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
  socialButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#e0e0e0', borderRadius: 12,
    paddingVertical: 14, backgroundColor: '#fff',
  },
  socialIcon: { fontSize: 20, marginRight: 8 },
  socialText: { fontSize: 14, fontWeight: '600', color: '#2c3e50' },

  // Signup link
  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signupText: { color: '#7f8c8d', fontSize: 15 },
  signupLink: { color: '#4CAF50', fontSize: 15, fontWeight: 'bold' },
});

export default LoginScreen;