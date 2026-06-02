import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { UserRole } from '@takwira/shared';
import { toast } from 'sonner';

interface SignUpProps {
  onSignUpSuccess: () => void;
}

const signUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email address.'),
    username: z
      .string()
      .min(3)
      .regex(/^[A-Za-z0-9_-]+$/, 'Please enter a valid username (only _ and - are allowed).'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(/(?=.*[a-z])/, 'Password must contain a lowercase letter.')
      .regex(/(?=.*[A-Z])/, 'Password must contain an uppercase letter.')
      .regex(/(?=.*\d)/, 'Password must contain a number.')
      .regex(/(?=.*\W)/, 'Password must contain a symbol.'),
    confirmPassword: z.string(),
    phoneNumber: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number.'),
    role: z.nativeEnum(UserRole),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUp({ onSignUpSuccess }: SignUpProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', username: '', password: '', confirmPassword: '', phoneNumber: '', role: UserRole.NormalUser },
  });

  const onSubmit =  async (data: SignUpForm) => {
    setServerError(null);
    try {
      const res = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to sign up');
      }

      toast.success('Account created! Welcome to the squad.');
      onSignUpSuccess();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="bg-gray-900 border border-emerald-800/30 rounded-2xl p-8 shadow-xl shadow-black/20">
      <h2 className="text-2xl font-semibold text-center text-emerald-400 mb-6">Join the squad</h2>
      
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
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register('username')}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>}
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
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            {...register('phoneNumber')}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</p>}
        </div>
        <div>
          <fieldset>
            <legend className="text-sm font-medium text-gray-300 mb-2">I am a:</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={UserRole.StadiumOwner} {...register('role')} className="accent-emerald-500 w-4 h-4" />
                <span className="text-gray-300">Stadium Owner</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={UserRole.NormalUser} {...register('role')} className="accent-emerald-500 w-4 h-4" />
                <span className="text-gray-300">Normal User</span>
              </label>
            </div>
            {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>}
          </fieldset>
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/30 active:scale-[0.98]"
        >
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </button>
        <Link
          to="/"
          className="block text-center w-full py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold
                     transition-all duration-300 hover:shadow-lg hover:shadow-black/20 mt-3"
        >
          Back to Login
        </Link>
      </form>
    </div>
  );
}
