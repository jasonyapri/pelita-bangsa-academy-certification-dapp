'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { Card, CardMedia } from '@mui/material';
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { PBACERT, DEFAULT_CHAIN, getActiveChain } from "@/app/constants/contracts";
import { useActiveAccount, MediaRenderer } from "thirdweb/react";
import { upload, download, resolveScheme } from "thirdweb/storage";
import { MyCertificateDetail } from '@/components/my-certificate/my-certificate-detail';
import { camelCase } from 'lodash';

import { config } from '@/config';
import { IntegrationCard } from '@/components/integrations/integrations-card';
import type { Integration } from '@/components/integrations/integrations-card';
import { CompaniesFilters } from '@/components/integrations/integrations-filters';
import Alert from '@mui/material/Alert';
import { useReadContract } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { client } from "@/app/client";
import { Container } from '@mui/system';

interface UseReadContractOptions {
  contract: any;
  owner: string;
}

type Attribute = {
  trait_type: string;
  value: string | number;
  display_type?: string;
};

const integrations = [
  {
    id: 'INTEG-006',
    title: 'Dropbox',
    description: 'Dropbox is a file hosting service that offers cloud storage, file synchronization, a personal cloud.',
    logo: '/assets/logo-dropbox.png',
    installs: 594,
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
  },
  {
    id: 'INTEG-005',
    title: 'Medium Corporation',
    description: 'Medium is an online publishing platform developed by Evan Williams, and launched in August 2012.',
    logo: '/assets/logo-medium.png',
    installs: 625,
    updatedAt: dayjs().subtract(43, 'minute').subtract(1, 'hour').toDate(),
  },
  {
    id: 'INTEG-004',
    title: 'Slack',
    description: 'Slack is a cloud-based set of team collaboration tools and services, founded by Stewart Butterfield.',
    logo: '/assets/logo-slack.png',
    installs: 857,
    updatedAt: dayjs().subtract(50, 'minute').subtract(3, 'hour').toDate(),
  },
] satisfies Integration[];

export default function Page(): React.JSX.Element {

  const activeAccount = useActiveAccount();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [tokenId, setTokenId] = useState(null);

  const contract = getContract({
    client,
    chain: getActiveChain(),
    address: PBACERT,
  });

  const { data: rawCertificates, isLoading, error } = useReadContract(getOwnedNFTs, {
    contract: contract,
    owner: activeAccount?.address || ''
  });

  useEffect(() => {
    if (rawCertificates) {
      const certMetadata: any[] = rawCertificates.map(cert => cert.metadata);

      const processedCertificates: any[] = [];
      certMetadata.forEach((certificate) => {
        const resolvedImageURL = resolveScheme({
          client,
          uri: certificate.image || '',
        });
        certificate.image_url = resolvedImageURL;

        const certAttributes: Attribute[] = certificate.attributes;

        certAttributes.forEach((attribute) => {
          const key = camelCase(attribute.trait_type);
          certificate[key] = attribute.value;
        });

        processedCertificates.push(certificate);
      });
      setCertificates(processedCertificates);
    }
  }, [rawCertificates]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">My Certificate</Typography>
        </Stack>
      </Stack>
      {/* <CompaniesFilters /> */}
      { !activeAccount?.address ? (
        <Alert severity="info">Please connect to your Web3 Wallet...</Alert>
      ) : isLoading ? (
        <Alert severity="info">Fetching certificates...</Alert>
      ) : 
      error ? (
        <Alert severity="error">Error fetching certificates</Alert>
      ) :
      certificates.length === 0 ? (
        <Alert severity="error">You have no certificate</Alert>
       ) : 
      (
        <Grid container spacing={3}>
          {certificates.map((certificate, index) => (
            <>
              <Grid lg={4} md={6} xs={12}>
                <MediaRenderer client={client} src={certificate.image} />
              </Grid>
              <Grid lg={8} md={6} xs={12}>
                <MyCertificateDetail certificate={certificate} />
              </Grid>
            </>
          ))}
        </Grid>
      )}
      {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={3} size="small" />
      </Box> */}
    </Stack>
  );
}
