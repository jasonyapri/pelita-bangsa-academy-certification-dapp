'use client';

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
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import ButtonGroup from '@mui/material/ButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';

import { config } from '@/config';
import { IntegrationCard } from '@/components/verify/verify-card';
import type { Integration } from '@/components/verify/verify-card';
import { Card, CardMedia } from '@mui/material';
import Alert from '@mui/material/Alert';

export default function Page(): React.JSX.Element {
  const [certificateId, setCertificateId] = useState('');

  const searchCertificateById = async (certificateId: string) => {
    console.log(certificateId);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Verify</Typography>
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
      <Card sx={{ p: 2 }}>
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <OutlinedInput
            value={certificateId}
            onChange={e => setCertificateId(e.target.value)}
            placeholder="Search Certificate by ID"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
          />
          <LoadingButton sx={{ p: 2 }} loading={false} loadingPosition="start" variant="contained" startIcon={(<MagnifyingGlassIcon />)} onClick={() => {searchCertificateById(certificateId)}}>
            Search
          </LoadingButton>
        </ButtonGroup>
      </Card>
      <Grid container spacing={3}>
        <Grid lg={12} md={12} xs={12}>
          <Alert severity="error" sx={{ marginBottom: 2 }}>Certificate not found</Alert>

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
