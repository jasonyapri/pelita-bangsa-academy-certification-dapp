'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { FileArrowUp as FileArrowUpIcon } from '@phosphor-icons/react/dist/ssr/FileArrowUp';
import { client } from "@/app/client";
import { getContract, prepareContractCall } from "thirdweb";
import { base, baseSepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount, useReadContract, useSendTransaction, TransactionButton } from "thirdweb/react"
import { PBACERT } from "@/app/constants/contracts";
import { toast } from 'react-toastify';

const certificateCategories = [
  { value: 'Bootcamp', label: 'Bootcamp' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Training', label: 'Training' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
] as const;

const certificateTypes = [
  { value: 'Certificate of Completion', label: 'Certificate of Completion' },
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
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const contract = getContract({
    client,
    chain: baseSepolia,
    address: PBACERT,
  });

  const { mutate: sendTransaction } = useSendTransaction();

  const [fullName, setFullName] = useState("Jason Yapri");
  const [walletAddress, setWalletAddress] = useState("0xD86399B0D9ac3a9A7fCFc1dd90c67Ece2792Fbe7");
  const [certificateName, setCertificateName] = useState("Blockchain Developer Bootcamp");
  const [issuer, setIssuer] = useState("Pelita Bangsa Academy");
  const [certificateCategory, setCertificateCategory] = useState("Bootcamp");
  const [certificateType, setCertificateType] = useState("Certificate of Completion");
  const [cohort, setCohort] = useState(1);
  const [duration, setDuration] = useState("21 sessions");
  const [startDate, setStartDate] = useState("June 11, 2024");
  const [endDate, setEndDate] = useState("August 29, 2024");
  const [instructor1, setInstructor1] = useState("Jason Yapri");
  const [instructor2, setInstructor2] = useState("Yevonnael Andrew");
  const [externalUrl, setExternalUrl] = useState("https://www.pelitabangsa.co.id/bootcamp");
  const [description, setDescription] = useState("This is to certify that this person has successfully completed a 3-month Blockchain Developer Bootcamp by Pelita Bangsa Academy.");

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
                <OutlinedInput defaultValue="Jason Yapri" label="Full name" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Wallet address</InputLabel>
                <OutlinedInput defaultValue="0xD86399B0D9ac3a9A7fCFc1dd90c67Ece2792Fbe7" label="Wallet address" name="walletAddress"  value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Certificate Name</InputLabel>
                <OutlinedInput defaultValue="Blockchain Developer Bootcamp" label="Certificate Name" name="certificateName" value={certificateName} onChange={(e) => setCertificateName(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Issuer</InputLabel>
                <OutlinedInput defaultValue="Pelita Bangsa Academy" label="Issuer" name="issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Certificate Category</InputLabel>
                <Select defaultValue="Bootcamp" label="Certificate Category" name="certificateCategory" variant="outlined" value={certificateCategory} onChange={(e) => setCertificateCategory(e.target.value)}>
                  {certificateCategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Certificate Type</InputLabel>
                <Select defaultValue="Certificate of Completion" label="Certificate Type" name="certificateType" variant="outlined" value={certificateType} onChange={(e) => setCertificateType(e.target.value)}>
                  {certificateTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Cohort</InputLabel>
                <OutlinedInput defaultValue="1" label="Cohort" name="cohort" type="number" value={cohort} onChange={(e) => setCohort(Number(e.target.value))} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Duration</InputLabel>
                <OutlinedInput defaultValue="21 sessions" label="Duration" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Start Date</InputLabel>
                <OutlinedInput defaultValue="June 11, 2024" label="Start Date" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>End Date</InputLabel>
                <OutlinedInput defaultValue="August 29, 2024" label="End Date" name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Instructor 1</InputLabel>
                <OutlinedInput defaultValue="Jason Yapri" label="Instructor 1" name="instructor1" value={instructor1} onChange={(e) => setInstructor1(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Instructor 2</InputLabel>
                <OutlinedInput defaultValue="Yevonnael Andrew" label="Instructor 2" name="instructor2" value={instructor2} onChange={(e) => setInstructor2(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>External URL</InputLabel>
                <OutlinedInput defaultValue="https://www.pelitabangsa.co.id/bootcamp" label="External URL" name="externalUrl" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12} marginTop={1}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<FileArrowUpIcon />}
              >
                Upload file
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  // multiple
                />
              </Button> &nbsp;{file && `Selected file: ${file.name}`}
            </Grid>
            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Description</InputLabel>
                <OutlinedInput defaultValue="This is to certify that this person has successfully completed a 3-month Blockchain Developer Bootcamp by Pelita Bangsa Academy." label="Description" name="description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </FormControl>
            </Grid>
          </Grid>
          
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {/* <Button type="submit" variant="contained" disabled={isLoadingIssue}>Issue Certificate</Button> */}
          <TransactionButton
            type="submit"
            transaction={() => {
              const studentAddress = "0x47331edc7220ad93D62130CE64c10F7166F4c947";
              const _tokenURI = "https://pelitabangsa.co.id";
              const dataHash = "0xdc10d28bd930d9a231dfce13798cb3c8a610c24ce69112195b25dfe442c339ce";
              const fileHash = "0xfe301f3f0cab010a4a67d507e6c4ef874a2ebd21f5669684663d56136de08719";

              if (!file) {
                console.error("File is not uploaded yet.");
                return Promise.reject(new Error("File is not uploaded yet."));;
              }

              const tx = prepareContractCall({ 
                contract, 
                method: "function issueCertificate(address studentAddress, string _tokenURI, bytes32 dataHash, bytes32 fileHash)", 
                params: [studentAddress, _tokenURI, dataHash, fileHash] 
              });
              return tx;
            }}
            onTransactionSent={(result) => {
              toast.info("Issuing certificate...");
            }}
            onTransactionConfirmed={(receipt) => {
              console.log("Transaction confirmed", receipt.transactionHash);
              toast.success(
                <div>
                  Certificate issued. Tx Hash:{' '}
                  <a href={`https://sepolia.basescan.org/tx/${receipt.transactionHash}`} target="_blank" rel="noopener noreferrer">
                    {receipt.transactionHash}
                  </a>
                </div>
              );
            }}
            onError={(error) => {
              console.error("Transaction error", error);
              toast.error(error.message);
            }}
          >
            Issue Certificate
          </TransactionButton>
        </CardActions>
      </Card>
    </form>
  );
}
