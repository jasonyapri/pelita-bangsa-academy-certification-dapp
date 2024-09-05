import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { IntegrationCard } from '@/components/dashboard/validate/validate-card';
import type { Integration } from '@/components/dashboard/validate/validate-card';
import { ValidateFilters } from '@/components/dashboard/validate/validate-filters';
import { Card, CardMedia } from '@mui/material';
import Alert from '@mui/material/Alert';

export const metadata = { title: `Integrations | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Validate</Typography>
          {/* <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack> */}
        </Stack>
        {/* <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div> */}
      </Stack>
      <ValidateFilters />
      <Grid container spacing={3}>
        <Grid lg={12} md={12} xs={12}>
          {/* <Alert severity="error">Certificate not found</Alert> */}
          <CardMedia
            component="img"
            // image={`https://ipfs.io/ipfs/${certificate.ipfsHash}`}
            image={`/assets/certificate/unic-certificate.jpg`}
            alt="Certificate"
          />
        </Grid>
      </Grid>
      {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={3} size="small" />
      </Box> */}
    </Stack>
  );
}
