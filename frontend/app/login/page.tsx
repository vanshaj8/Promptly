'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';
import { Button, Input, Card, CardBody } from '@/components/ui';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Logo from '@/components/Logo';
import { routes } from '@/lib/routes';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email, passwordLength: password.length });
      const response = await authAPI.login(email, password);
      console.log('Login successful:', response);
      
      const { token, user } = response;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      Cookies.set('token', token, { expires: 7 });
      console.log('Token saved to cookies');
      
      // Redirect based on role
      const redirectPath = user.role === 'ADMIN' ? routes.adminBrands : routes.dashboard;
      console.log('Redirecting to:', redirectPath);
      
      // Small delay to ensure cookie is saved, then redirect
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 50);
    } catch (err: any) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
      
      let errorMessage = 'Invalid email or password';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (err.response?.status === 0 || err.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={true} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to Promptly
          </h2>
          <p className="mt-2 text-sm font-medium text-primary-600">
            Replies, right on time
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Sign in to manage your Instagram engagement
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-soft-lg">
          <CardBody className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 animate-slide-up">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />

                <Input
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full"
                disabled={loading}
              >
                Sign in
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Demo credentials: admin@promptly.com / admin123
                </p>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs font-medium text-primary-600 mb-1">
            Replies, right on time
          </p>
          <p className="text-xs text-gray-500">
            © 2025 Promptly. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
