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
import moment from 'moment';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

export function MyCertificateDetail(certificate: any): React.JSX.Element {

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader={certificate.certificate.type} title={certificate.certificate.name} />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
          <Table>
            <TableBody>
              <TableRow hover>
                <TableCell colSpan={2} >
                  {certificate.certificate.description}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                Certificate ID
                </TableCell>
                <TableCell>
                  {certificate.certificate.certificateId}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                  Full Name
                </TableCell>
                <TableCell>
                  {certificate.certificate.fullName}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   Cohort
                </TableCell>
                <TableCell>
                  {certificate.certificate.cohort}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   Date Issued
                </TableCell>
                <TableCell>
                  {moment(certificate.certificate.dateIssued).format('MMMM D, YYYY')}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   Issued By
                </TableCell>
                <TableCell>
                  {certificate.certificate.issuer}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   Category
                </TableCell>
                <TableCell>
                  {certificate.certificate.category}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   Duration
                </TableCell>
                <TableCell>
                  {certificate.certificate.duration}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   Start Date
                </TableCell>
                <TableCell>
                  {certificate.certificate.startDate}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   End Date
                </TableCell>
                <TableCell>
                  {certificate.certificate.endDate}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   External URL
                </TableCell>
                <TableCell>
                  <a href={certificate.certificate.external_url} target='_blank'>{certificate.certificate.external_url}</a>
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   Instructor 1
                </TableCell>
                <TableCell>
                  {certificate.certificate.instructor1}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                Instructor 2
                </TableCell>
                <TableCell>
                  {certificate.certificate.instructor2}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                   Instructor 3
                </TableCell>
                <TableCell>
                  {certificate.certificate.instructor3 ?? "-"}
                </TableCell>
              </TableRow>
              <TableRow hover>
                <TableCell variant='head'>
                Instructor 4
                </TableCell>
                <TableCell>
                  {certificate.certificate.instructor4 ?? "-"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </Grid>
        </CardContent>
        <Divider />
      </Card>
    </form>
  );
}
