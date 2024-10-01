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
import { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Fire as FireIcon } from '@phosphor-icons/react/dist/ssr/Fire';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import ButtonGroup from '@mui/material/ButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';
import { getContract, prepareContractCall } from "thirdweb";
import { base, baseSepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount, useReadContract, useSendTransaction, TransactionButton, MediaRenderer } from "thirdweb/react"
import { MyCertificateDetail } from '@/components/my-certificate/my-certificate-detail';
import { camelCase } from 'lodash';
import { upload, download, resolveScheme } from "thirdweb/storage";
import { Card, CardMedia } from '@mui/material';
import Alert from '@mui/material/Alert';
import { PBACERT } from "@/app/constants/contracts";
import { client } from "@/app/client";
import { getNFT } from "thirdweb/extensions/erc721";
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';

type Attribute = {
  trait_type: string;
  value: string | number;
  display_type?: string;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Page(): React.JSX.Element {

  const [tokenId, setTokenId] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const decimalValue = value.replace(/[^0-9]/g, ''); // Filter out non-hexadecimal characters
    setTokenId(decimalValue);
  };

  const contract = getContract({
    client,
    chain: baseSepolia,
    address: PBACERT,
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    if (tokenId != "") setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Batch Destroy</Typography>
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
            value={tokenId}
            onChange={handleInputChange}
            placeholder="Token ID"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
          />
          <LoadingButton sx={{ p: 2 }} loading={isLoading} color='error' loadingPosition="start" variant="contained" startIcon={(<FireIcon />)} onClick={handleOpen} disabled={tokenId == ""}>
            Batch Destroy
          </LoadingButton>
        </ButtonGroup>
        {/* <>
            <div>certificateId: {certificateId ? certificateId.toString() : "undefined"}</div>
            <div>certificateIdNumber: {certificateIdNumber ? certificateIdNumber.toString() : "undefined"}</div>
            <div>certificateIdNumberParam: {certificateIdNumberParam ? certificateIdNumberParam.toString() : "undefined"}</div>
            <div>certificateIdExists: {certificateIdExists ? "true" : "false"}</div>
        </> */}
      </Card>
      <Grid container spacing={3}>
      { isLoading ? (<Grid lg={12} md={12} xs={12}><Alert severity="warning" sx={{ marginBottom: 2 }}>Destroying certificate...</Alert></Grid>) : <></> }
      {/* <Grid lg={12} md={12} xs={12}><Alert severity="error" sx={{ marginBottom: 2 }}>Certificate Destroyed</Alert></Grid> */}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Certificate Destroy Confirmation
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to destroy this certificate with Token ID of {tokenId}?
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <TransactionButton
              type="submit"
              transaction={async () => {
                setIsLoading(true);

                const tx = prepareContractCall({ 
                  contract, 
                  method: "function destroyCertificate(uint256 tokenId)", 
                  params: [BigInt(tokenId)] 
                });
                return tx;
              }}
              onTransactionSent={(result) => {
                handleClose();
                toast.info("Destroying certificate...");
                setIsLoading(false);
                setTokenId("");
              }}
              onTransactionConfirmed={(receipt) => {
                // console.log("Transaction confirmed", receipt.transactionHash);
                toast.success(
                  <div>
                    Certificate Destroyed. Tx Hash:{' '}
                    <a href={`https://sepolia.basescan.org/tx/${receipt.transactionHash}`} target="_blank" rel="noopener noreferrer">
                      {receipt.transactionHash}
                    </a>
                  </div>
                );
              }}
              onError={(error) => {
                // console.error("Transaction error", error);
                toast.error(error.message);
                handleClose();
                setIsLoading(false);
                setTokenId("");
              }}
              disabled={false}
            >
              Destroy
            </TransactionButton>
            <Button variant="contained" onClick={handleClose}>No</Button>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
}
