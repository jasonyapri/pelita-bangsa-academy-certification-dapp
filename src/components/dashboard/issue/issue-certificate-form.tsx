'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const certificateTypes = [
  { value: 'bootcamp', label: 'Bootcamp' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'training', label: 'Training' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
] as const;
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function IssueCertificateForm(): React.JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        {/* <CardHeader subheader="asdf" title="Profile" /> */}
        {/* <Divider /> */}
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Full name</InputLabel>
                <OutlinedInput defaultValue="" label="Full name" name="fullName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Wallet address</InputLabel>
                <OutlinedInput defaultValue="" label="Wallet address" name="walletAddress" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Certificate Type</InputLabel>
                <Select defaultValue="bootcamp" label="Certificate Type" name="certificateType" variant="outlined">
                  {certificateTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Title</InputLabel>
                <OutlinedInput label="Title" />
              </FormControl>
            </Grid>
          </Grid>
          <Grid md={6} xs={12} marginTop={1}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
              />
            </Button>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Issue Certificate</Button>
        </CardActions>
      </Card>
    </form>
  );
}
