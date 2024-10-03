'use client';

import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';
// import SaveIcon from '@mui/icons-material/Save';

export function VerifyFilters(searchCertificateById: (id: string) => void): React.JSX.Element {

  return (
    <Card sx={{ p: 2 }}>
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        {/* <OutlinedInput
          value={certificateId}
          onChange={(e) => (e.target.value)}
          placeholder="Search Certificate by ID"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
        /> */}
        {/* <LoadingButton sx={{ p: 2 }} loading={false} loadingPosition="start" variant="contained" startIcon={(<MagnifyingGlassIcon />)} onClick={() => {searchCertificateById(certificateId)}}>
          Search
        </LoadingButton> */}
      </ButtonGroup>
    </Card>
  );
}
