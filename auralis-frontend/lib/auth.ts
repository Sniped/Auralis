import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

// Initialize Cognito User Pool with environment variables
const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
};

const userPool = new CognitoUserPool(poolData);

/**
 * Sign in user with email and password
 * Handles NEW_PASSWORD_REQUIRED challenge for first-time users
 */
export const signIn = (
  email: string,
  password: string
): Promise<{
  success: boolean;
  requiresPasswordChange?: boolean;
  cognitoUser?: CognitoUser;
  session?: CognitoUserSession;
  error?: string;
}> => {
  return new Promise((resolve) => {
    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session: CognitoUserSession) => {
        resolve({
          success: true,
          session,
        });
      },
      onFailure: (err) => {
        resolve({
          success: false,
          error: err.message || 'Authentication failed',
        });
      },
      newPasswordRequired: () => {
        // User needs to set a new password
        resolve({
          success: true,
          requiresPasswordChange: true,
          cognitoUser,
        });
      },
    });
  });
};

/**
 * Complete new password challenge for first-time users
 */
export const changePassword = (
  cognitoUser: CognitoUser,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    cognitoUser.completeNewPasswordChallenge(
      newPassword,
      {},
      {
        onSuccess: () => {
          resolve({ success: true });
        },
        onFailure: (err) => {
          resolve({
            success: false,
            error: err.message || 'Password change failed',
          });
        },
      }
    );
  });
};

/**
 * Sign out the current user
 */
export const signOut = (): void => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};

/**
 * Get current user from pool
 */
export const getCurrentUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};

/**
 * Get current valid session or null
 */
export const getCurrentSession = (): Promise<CognitoUserSession | null> => {
  return new Promise((resolve) => {
    const cognitoUser = getCurrentUser();
    
    if (!cognitoUser) {
      resolve(null);
      return;
    }

    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session) {
        resolve(null);
        return;
      }

      if (!session.isValid()) {
        resolve(null);
        return;
      }

      resolve(session);
    });
  });
};

/**
 * Check if user is authenticated with valid session
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getCurrentSession();
  return session !== null;
};
