import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const DEMO_CREDENTIALS = {
  username: 'demo@goatapp.com',
  password: 'Password123',
};

const FormInput = ({
  accessibilityLabel,
  autoComplete,
  autoCapitalize = 'none',
  error,
  keyboardType = 'default',
  label,
  onChangeText,
  onSubmitEditing,
  placeholder,
  returnKeyType,
  secureTextEntry,
  showPasswordToggle,
  value,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          accessibilityLabel={accessibilityLabel}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={false}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor="#8b95a7"
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          style={styles.input}
          value={value}
        />
        {showPasswordToggle && (
          <Pressable
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => setIsPasswordVisible(visible => !visible)}
            style={styles.passwordToggle}>
            <Text style={styles.passwordToggleText}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const LoginScreen = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const clearFieldError = field => {
    setErrors(currentErrors => ({...currentErrors, [field]: undefined}));
  };

  const validate = () => {
    const nextErrors = {};
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      nextErrors.identifier = 'Enter your email address or username.';
    } else if (
      trimmedIdentifier.includes('@') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedIdentifier)
    ) {
      nextErrors.identifier = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Enter your password.';
    } else if (password.length < 6) {
      nextErrors.password = 'Your password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    // TODO: Replace this temporary check with your API or Firebase sign-in call.
    await new Promise(resolve => setTimeout(resolve, 700));

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const hasValidCredentials =
      (normalizedIdentifier === DEMO_CREDENTIALS.username ||
        normalizedIdentifier === 'demo') &&
      password === DEMO_CREDENTIALS.password;

    setIsLoading(false);

    if (!hasValidCredentials) {
      setErrors({
        form: 'We could not sign you in. Check your credentials and try again.',
      });
      return;
    }

    Alert.alert('Welcome back', `You are signed in as ${identifier.trim()}.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>G</Text>
            </View>
            <Text style={styles.logo}>GOAT APP</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue to your account.</Text>

            {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

            <FormInput
              accessibilityLabel="Email address or username"
              autoComplete="username"
              error={errors.identifier}
              keyboardType="email-address"
              label="Email or username"
              onChangeText={text => {
                setIdentifier(text);
                clearFieldError('identifier');
                clearFieldError('form');
              }}
              onSubmitEditing={handleLogin}
              placeholder="you@example.com"
              returnKeyType="next"
              value={identifier}
            />

            <FormInput
              accessibilityLabel="Password"
              autoComplete="password"
              error={errors.password}
              label="Password"
              onChangeText={text => {
                setPassword(text);
                clearFieldError('password');
                clearFieldError('form');
              }}
              onSubmitEditing={handleLogin}
              placeholder="Enter your password"
              returnKeyType="go"
              secureTextEntry
              showPasswordToggle
              value={password}
            />

            <View style={styles.optionsRow}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{checked: rememberMe}}
                onPress={() => setRememberMe(checked => !checked)}
                style={styles.rememberOption}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => Alert.alert('Password reset', 'Password recovery will be connected when authentication is configured.')}>
                <Text style={styles.linkText}>Forgot password?</Text>
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={isLoading}
              onPress={handleLogin}
              style={({pressed}) => [
                styles.button,
                (pressed || isLoading) && styles.buttonPressed,
              ]}>
              <Text style={styles.buttonText}>{isLoading ? 'Signing in…' : 'Sign in'}</Text>
            </Pressable>

            <View style={styles.register}>
              <Text style={styles.registerPrompt}>New to GOAT APP?</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => Alert.alert('Create account', 'Account registration will be connected when authentication is configured.')}>
                <Text style={styles.registerText}>Create account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },
  brandMark: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    marginBottom: 14,
    width: 56,
  },
  brandMarkText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  logo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563eb',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111827',
    marginTop: 12,
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 32,
    marginTop: 8,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    flexDirection: 'row',
    height: 56,
  },
  inputError: {
    borderColor: '#dc2626',
  },
  input: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingHorizontal: 16,
  },
  passwordToggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  passwordToggleText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    marginTop: 6,
  },
  formError: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderRadius: 10,
    borderWidth: 1,
    color: '#b91c1c',
    fontSize: 14,
    marginBottom: 18,
    padding: 12,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rememberOption: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#9ca3af',
    borderRadius: 4,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    marginRight: 8,
    width: 20,
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  rememberText: {
    color: '#4b5563',
    fontSize: 14,
  },
  linkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  register: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  registerPrompt: {
    color: '#6b7280',
    fontSize: 14,
  },
  registerText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 5,
  },
});

export default LoginScreen;
