import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { BatchIssueCertificateForm } from '@/components/batch-issue/batch-issue-certificate-form';

// export const metadata = { title: `Batch Issue Certificate | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Batch Issue Certificate</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={12} md={12} xs={12}>
          <BatchIssueCertificateForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
