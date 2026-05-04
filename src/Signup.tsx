import validator from 'validator';

export function SignUp() {
  return (
    <div className="sign-up-form">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formDataS = new FormData(e.currentTarget);
          const usernameS = validator.trim(
            (formDataS.get('username') as string) || '',
          );
          const passwordS = validator.trim(
            (formDataS.get('password') as string) || '',
          );

          const confirmPasswordS = validator.trim(
            (formDataS.get('confirmPassword') as string) || '',
          );
          const emailS = validator.trim(
            (formDataS.get('email') as string) || '',
          );
          const phoneNumberS = validator.trim(
            (formDataS.get('phoneNumber') as string) || '',
          );
          const roleS = validator.trim((formDataS.get('role') as string) || '');

          if (
            !validator.isAlphanumeric(usernameS, 'en-US', {
              ignore: '_-',
            })
          ) {
            alert(
              'Please enter a valid username(only _ and - are allowed as symbols',
            );
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
              'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
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
          if (passwordS != confirmPasswordS) {
            alert('Passwords do not match.');
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
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input type="text" id="phoneNumber" name="phoneNumber" required />
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
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
}
