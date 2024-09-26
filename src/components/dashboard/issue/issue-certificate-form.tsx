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
import { ConnectButton, useActiveAccount, useReadContract, useSendTransaction, TransactionButton, MediaRenderer } from "thirdweb/react"
import { PBACERT } from "@/app/constants/contracts";
import { toast } from 'react-toastify';
import { upload, download } from "thirdweb/storage";
import { keccak256 } from 'js-sha3';

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
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [imageHash, setImageHash] = useState<string | null>(null);

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    setFile(event.target.files[0]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
      };
      img.src = e.target?.result as string;

      // Generate image hash
      const response = await fetch(e.target?.result as string);
      const arrayBuffer = await response.arrayBuffer();
      const hash = keccak256(arrayBuffer);
      setImageHash(hash);
    };
    reader.readAsDataURL(selectedFile);
  };

  const contract = getContract({
    client,
    chain: baseSepolia,
    address: PBACERT,
  });

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

  const uploadFileToIpfs = async () => {
    if (!file) {
      return Promise.reject(new Error("File is not selected yet."));
    }

    try {
      const uri = await upload({
        client,
        files: [file],
      });
      // console.warn(uri);
      return uri;
    } catch (error) {
      // console.error("Upload error", error);
      throw error;
    }
  };

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
                <OutlinedInput label="Full name" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Wallet address</InputLabel>
                <OutlinedInput label="Wallet address" name="walletAddress"  value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Certificate Name</InputLabel>
                <OutlinedInput label="Certificate Name" name="certificateName" value={certificateName} onChange={(e) => setCertificateName(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Issuer</InputLabel>
                <OutlinedInput label="Issuer" name="issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Certificate Category</InputLabel>
                <Select label="Certificate Category" name="certificateCategory" variant="outlined" value={certificateCategory} onChange={(e) => setCertificateCategory(e.target.value)}>
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
                <Select label="Certificate Type" name="certificateType" variant="outlined" value={certificateType} onChange={(e) => setCertificateType(e.target.value)}>
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
                <OutlinedInput label="Cohort" name="cohort" type="number" value={cohort} onChange={(e) => setCohort(Number(e.target.value))} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Duration</InputLabel>
                <OutlinedInput label="Duration" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Start Date</InputLabel>
                <OutlinedInput label="Start Date" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>End Date</InputLabel>
                <OutlinedInput label="End Date" name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Instructor 1</InputLabel>
                <OutlinedInput label="Instructor 1" name="instructor1" value={instructor1} onChange={(e) => setInstructor1(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Instructor 2</InputLabel>
                <OutlinedInput label="Instructor 2" name="instructor2" value={instructor2} onChange={(e) => setInstructor2(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>External URL</InputLabel>
                <OutlinedInput label="External URL" name="externalUrl" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} />
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
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                  // multiple
                />
              </Button> &nbsp;{file && `Selected file: ${file.name}`}
            </Grid>
            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Description</InputLabel>
                <OutlinedInput label="Description" name="description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </FormControl>
            </Grid>
          </Grid>
          
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {/* <Button type="submit" variant="contained" disabled={isLoadingIssue}>Issue Certificate</Button> */}
          <TransactionButton
            type="submit"
            transaction={async () => {
              const dataHash = "0xdc10d28bd930d9a231dfce13798cb3c8a610c24ce69112195b25dfe442c339ce";
              const fileHash = "0xfe301f3f0cab010a4a67d507e6c4ef874a2ebd21f5669684663d56136de08719";

              if (!file) {
                // console.error("File is not uploaded yet.");
                return Promise.reject(new Error("File is not uploaded yet!"));
              }

              const fileSize = file.size;
              const fileType = file.type;

              if (file.type !== "image/jpeg" && file.type !== "image/png") {
                return Promise.reject(new Error("File should be an image!"));
              }

              const imageUri = await uploadFileToIpfs();

              const _tokenURI = await upload({
                  client,
                  files: [
                    {
                      "name": certificateName,
                      "created_by": issuer,
                      "external_url": externalUrl,
                      "description": description,
                      "attributes": [
                        {
                            "trait_type": "Issuer",
                            "value": issuer
                          },
                        {
                            "trait_type": "Category",
                            "value": certificateCategory
                          },
                        {
                            "trait_type": "Type",
                            "value": certificateType
                          },
                        {
                          "display_type": "number", 
                            "trait_type": "Cohort",
                            "value": cohort
                          },
                        {
                            "trait_type": "Full Name",
                            "value": fullName
                          },
                        {
                            "trait_type": "Duration",
                            "value": duration
                          },
                        {
                            "trait_type": "Start Date",
                            "value": startDate
                          },
                        {
                            "trait_type": "End Date",
                            "value": endDate
                          },
                        {
                            "trait_type": "Instructor 1",
                            "value": instructor1
                          },
                        {
                            "trait_type": "Instructor 2",
                            "value": instructor2
                          },
                        {
                            "display_type": "date", 
                            "trait_type": "Date Issued",
                            "value": Date.now()
                          },
                      ],
                      "image_details": {
                        "bytes": fileSize,
                        "format": fileType.split('/')[1].toUpperCase(),
                        "keccak256": imageHash,
                        "width": imageWidth,
                        "height": imageHeight
                      },
                      "image": imageUri,
                      "image_url": imageUri
                    },
                  ],
              });

              const tx = prepareContractCall({ 
                contract, 
                method: "function issueCertificate(address studentAddress, string _tokenURI, bytes32 dataHash, bytes32 fileHash)", 
                params: [walletAddress, _tokenURI, dataHash, fileHash] 
              });
              return tx;
            }}
            onTransactionSent={(result) => {
              toast.info("Issuing certificate...");
            }}
            onTransactionConfirmed={(receipt) => {
              // console.log("Transaction confirmed", receipt.transactionHash);
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
              // console.error("Transaction error", error);
              toast.error(error.message);
            }}
          >
            Issue Certificate
          </TransactionButton>
          <Button
            onClick={() => {
              uploadFileToIpfs().then((uri) => {
                // console.log(uri);
                setCurrentUri(uri);
              }).catch((error) => {
                toast.error("Upload error", error);
              });
            }}
          >Upload to IPFS</Button>
          <Button onClick={async () => {
            const response = await download({
              client,
              uri: "ipfs://QmaWZwvhgU9yQokQ334eVJFy6615jqdSnSXzh7NAfm3egC/thumbnail.jpg",
            });
            const url = response.url;
            setImageUrl(url);
          }}>
            Download URL
          </Button>
        </CardActions>
        {imageUrl && (
          <CardContent>
            <img src={imageUrl} alt="Downloaded from IPFS" style={{ maxWidth: '100%', height: 'auto' }} />
          </CardContent>
        )}
        {imageUrl && (
          <CardContent>
            <MediaRenderer client={client} src={currentUri} />
          </CardContent>
        )}
      </Card>
    </form>
  );
}
