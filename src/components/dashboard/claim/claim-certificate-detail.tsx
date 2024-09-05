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
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

export function ClaimCertificateDetail(): React.JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="Certificate of Completion" title="Bootcamp Blockchain Developer" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
          <Table>
            <TableBody>
              <TableRow hover>
                <TableCell variant='head'>
                   Full Name
                </TableCell>
                <TableCell>
                  Jason Yapri
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                  Certificate Type
                </TableCell>
                <TableCell>
                  Bootcamp
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   Cohort
                </TableCell>
                <TableCell>
                  1
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   Date Acquired
                </TableCell>
                <TableCell>
                  Thursday, 5 September 2024
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Claim</Button>
        </CardActions>
      </Card>
    </form>
  );
}
