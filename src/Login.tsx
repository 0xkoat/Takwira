import validator from 'validator';

export function Login() {
  return (
    <div className="login-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formDataL = new FormData(e.currentTarget);
          const usernameL = (formDataL.get('username') as string) || '';
          const passwordL = (formDataL.get('password') as string) || '';

          const sanitizedUsernameL = validator.escape(
            validator.trim(usernameL),
          );
          const sanitizedPasswordL = validator.trim(passwordL);
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
