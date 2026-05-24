import validator from 'validator';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  return (
    <div className="bg-gray-900 border border-emerald-800/30 rounded-2xl p-8 shadow-xl shadow-black/20">
      <h2 className="text-2xl font-semibold text-center text-emerald-400 mb-6">
        Welcome back
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const usernameL = validator.trim(
            ((form.elements.namedItem('username') as HTMLInputElement)?.value as string) || '',
          );
          const passwordL = validator.trim(
            ((form.elements.namedItem('password') as HTMLInputElement)?.value as string) || '',
          );

          if (!usernameL || !passwordL) {
            alert('Please enter both username and password.');
            return;
          }
          if (!validator.isAlphanumeric(usernameL, 'en-US', { ignore: '_-' })) {
            alert('Invalid username format.');
            return;
          }
          onLoginSuccess();
        }}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          <div className="text-right mt-1">
            <a
              href="/forgot-password"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
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
      </form>
    </div>
  );
}
