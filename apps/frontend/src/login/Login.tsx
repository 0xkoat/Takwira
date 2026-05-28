import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserData, UserRole } from '@takwira/shared';
import { Link } from '@tanstack/react-router';

interface LoginProps {
  onLoginSuccess: (user : UserData) => void;
}

const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Please enter your username.')
    .regex(/^[A-Za-z0-9_-]+$/, 'Invalid username format.'),
  password: z.string().min(1, 'Please enter your password.'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login({ onLoginSuccess }: LoginProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = (data: LoginForm) => {
    const role = data.username.toLowerCase() === 'owner' ? UserRole.StadiumOwner : UserRole.NormalUser;

    const fakeUser: UserData = {
      username: data.username,
      email: 'robaa@siks.com',
      phoneNumber: '123454678',
      role,
      imageUrl: '',
    };
    onLoginSuccess(fakeUser);
   
  };

  return (
    <div className="bg-gray-900 border border-emerald-800/30 rounded-2xl p-8 shadow-xl shadow-black/20">
      <h2 className="text-2xl font-semibold text-center text-emerald-400 mb-6">Welcome back</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <div className="text-right mt-1">
            <a href="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold
                     transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/30 active:scale-[0.98]"
        >
          Login
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
