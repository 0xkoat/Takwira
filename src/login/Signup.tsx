import validator from 'validator';

interface SignUpProps {
  onSignUpSuccess: () => void;
}

export function SignUp({ onSignUpSuccess }: SignUpProps) {
  return (
    <div className="bg-gray-900 border border-emerald-800/30 rounded-2xl p-8 shadow-xl shadow-black/20">
      <h2 className="text-2xl font-semibold text-center text-emerald-400 mb-6">
        Join the squad
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const usernameS = validator.trim(
            ((form.elements.namedItem('username') as HTMLInputElement)?.value as string) || '',
          );
          const passwordS = validator.trim(
            ((form.elements.namedItem('password') as HTMLInputElement)?.value as string) || '',
          );
          const confirmPasswordS = validator.trim(
            ((form.elements.namedItem('confirmPassword') as HTMLInputElement)?.value as string) || '',
          );
          const emailS = validator.trim(
            ((form.elements.namedItem('email') as HTMLInputElement)?.value as string) || '',
          );
          const phoneNumberS = validator.trim(
            ((form.elements.namedItem('phoneNumber') as HTMLInputElement)?.value as string) || '',
          );
          const roleInput = form.querySelector('input[name="role"]:checked') as HTMLInputElement | null;
          const roleS = validator.trim((roleInput?.value as string) || '');

          if (!validator.isAlphanumeric(usernameS, 'en-US', { ignore: '_-' })) {
            alert('Please enter a valid username (only _ and - are allowed).');
            return;
          }
          if (
            !validator.isStrongPassword(passwordS, {
              minLength: 8,
              minLowercase: 1,
              minUppercase: 1,
              minNumbers: 1,
              minSymbols: 1,
            })
          ) {
            alert(
              'Password must contain at least one uppercase, one lowercase, one number, and one symbol.',
            );
            return;
          }
          if (!validator.isEmail(emailS)) {
            alert('Please enter a valid email address.');
            return;
          }
          if (!validator.isMobilePhone(phoneNumberS)) {
            alert('Please enter a valid phone number.');
            return;
          }
          if (!roleS) {
            alert('Please select your account type.');
            return;
          }
          if (passwordS !== confirmPasswordS) {
            alert('Passwords do not match.');
            return;
          }
          onSignUpSuccess();
        }}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
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
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <fieldset>
            <legend className="text-sm font-medium text-gray-300 mb-2">
              I am a:
            </legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="stadium_owner"
                  className="accent-emerald-500 w-4 h-4"
                />
                <span className="text-gray-300">Stadium Owner</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="normal_user"
                  className="accent-emerald-500 w-4 h-4"
                />
                <span className="text-gray-300">Normal User</span>
              </label>
            </div>
          </fieldset>
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold
                     transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/30 active:scale-[0.98]"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
