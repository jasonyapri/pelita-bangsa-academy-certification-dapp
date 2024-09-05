import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { ClaimCertificateDetail } from '@/components/dashboard/claim/claim-certificate-detail';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { Card, CardMedia } from '@mui/material';
import Alert from '@mui/material/Alert';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Claim</Typography>
      </div>
      <Alert severity="error">You have no certificates to claim</Alert>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <CardMedia
            component="img"
            // image={`https://ipfs.io/ipfs/${certificate.ipfsHash}`}
            image={`/assets/certificate/unic-certificate.jpg`}
            alt="Certificate"
          />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <ClaimCertificateDetail />
        </Grid>
      </Grid>
    </Stack>
  );
}
