export const paths = {
  home: '/',
  // auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  verify: '/verify',
  // claim: '/dashboard/claim',
  myCertificate: '/my-certificate',
  issue: '/issue',
  batchIssue: '/batch-issue',
  destroy: '/destroy',
  batchDestroy: '/batch-destroy',
  errors: { notFound: '/errors/not-found' },
} as const;
