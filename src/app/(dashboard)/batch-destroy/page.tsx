'use client';

import * as React from 'react';
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
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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
  
  const [isLoading, setIsLoading] = useState(false);

  const contract = getContract({
    client,
    // chain: baseSepolia,
    chain: base,
    address: PBACERT,
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    if (value.length > 0) setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [value, setValue] = useState<string[]>([]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Batch Destroy Certificate</Typography>
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
          {/* <OutlinedInput
            value={tokenId}
            onChange={handleInputChange}
            placeholder="Token ID"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
          /> */}
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            style={{ width: 500 }}
            value={value}
            onChange={(event, newValue) => {
              const cleanedValue = newValue.map((item) => item.toString().replace(/[^0-9]/g, '')).filter(item => item !== '');;
              setValue(cleanedValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Enter Token IDs"
                placeholder="Type and press Enter"
              />
            )}
          />
          <LoadingButton sx={{ p: 2 }} loading={isLoading} color='error' loadingPosition="start" variant="contained" startIcon={(<FireIcon />)} onClick={handleOpen} disabled={value.length == 0}>
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
            Are you sure you want to destroy this certificate with Token ID of {value.join(', ')}?
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <TransactionButton
              type="submit"
              transaction={async () => {
                setIsLoading(true);

                const param = value.map((item) => BigInt(item));

                const tx = prepareContractCall({ 
                  contract, 
                  method: "function batchDestroyCertificate(uint256[] tokenIds)", 
                  params: [param] 
                });
                return tx;
              }}
              onTransactionSent={(result) => {
                handleClose();
                toast.info("Destroying certificate...");
                setIsLoading(false);
                setValue([]);
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
                setValue([]);
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
