import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserData } from '@takwira/shared';
import { Link } from '@tanstack/react-router';


interface LoginProps {
  onLoginSuccess: (user: UserData, token: string) => void;
}

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login({ onLoginSuccess }: LoginProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null); 
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to login');
      }
      const responseData = await res.json();
      onLoginSuccess(responseData.user, responseData.token);
    } catch (error) {
      console.error(error);
      setServerError(error instanceof Error ? error.message : 'An unknown error occurred');
   }
   
  };

  return (
    <div className="bg-gray-900 border border-emerald-800/30 rounded-2xl p-8 shadow-xl shadow-black/20">
      <h2 className="text-2xl font-semibold text-center text-emerald-400 mb-6">Welcome back</h2>
      
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium animate-pulse">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          <div className="text-right mt-1">
            <a href="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold
                     disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/30 active:scale-[0.98]"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-gray-400 text-sm">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-emerald-400 hover:text-emerald-300">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
