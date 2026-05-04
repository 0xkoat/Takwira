import validator from 'validator';

export function SignUp() {
  return (
    <div className="sign-up-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formDataS = new FormData(e.currentTarget);
          const usernameS = (formDataS.get('username') as string) || '';
          const passwordS = (formDataS.get('password') as string) || '';
          const emailS = (formDataS.get('email') as string) || '';
          const roleS = (formDataS.get('role') as string) || '';

          const sanitizedUsernameS = validator.escape(
            validator.trim(usernameS),
          );

          const sanitizedPasswordS = validator.trim(passwordS);
          const sanitizedEmailS = validator.escape(validator.trim(emailS));

          if (!roleS) {
            alert('Please select your account type.');
            return;
          }
        }}
      >
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>

        <div>
          <fieldset>
            <legend>I am a:</legend>
            <label>
              <input type="radio" name="role" value="stadium_owner" />
              Stadium owner
            </label>
            <label>
              <input type="radio" name="role" value="normal_user" />
              Normal user
            </label>
          </fieldset>
        </div>

        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
