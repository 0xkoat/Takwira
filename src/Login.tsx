import validator from 'validator';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  return (
    <div className="login-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formDataL = new FormData(e.currentTarget);
          const usernameL = validator.trim(
            (formDataL.get('username') as string) || '',
          );

          const passwordL = validator.trim(
            (formDataL.get('password') as string) || '',
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
      >
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />

          <div className="text-right text-sm mt-1">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
