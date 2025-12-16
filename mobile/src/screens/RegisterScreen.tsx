import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, TextInput } from '../components/ui';
import { colors, typography, spacing } from '../theme';
import { useAuthStore } from '../stores/authStore';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const register = useAuthStore((state) => state.register);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        phone: phone || undefined,
      });
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.error || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join Blue Sky Mountain Massage and start your wellness journey
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <TextInput
                label="First Name"
                placeholder="John"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                error={errors.firstName}
              />
            </View>
            <View style={styles.halfInput}>
              <TextInput
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                error={errors.lastName}
              />
            </View>
          </View>
          
          <TextInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="mail-outline"
            error={errors.email}
          />
          
          <TextInput
            label="Phone (Optional)"
            placeholder="555-123-4567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon="call-outline"
          />
          
          <TextInput
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />
          
          <TextInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.confirmPassword}
          />
          
          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            style={styles.button}
          />
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Button
              title="Sign In"
              onPress={() => navigation.navigate('Login')}
              variant="ghost"
              size="sm"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    lineHeight: 24,
  },
  form: {
    backgroundColor: colors.background.card,
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  button: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
  },
});
