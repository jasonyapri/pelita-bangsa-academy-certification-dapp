export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    verify: '/dashboard/verify',
    // claim: '/dashboard/claim',
    myCertificate: '/dashboard/my-certificate',
    issue: '/dashboard/issue',
    batchIssue: '/dashboard/batch-issue',
    // overview: '/dashboard',
    // account: '/dashboard/account',
    // customers: '/dashboard/customers',
    // integrations: '/dashboard/integrations',
    // settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
