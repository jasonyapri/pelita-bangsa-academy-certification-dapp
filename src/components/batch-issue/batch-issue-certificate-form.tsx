'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import { FileArrowUp as FileArrowUpIcon } from '@phosphor-icons/react/dist/ssr/FileArrowUp';
import { Certificate as CertificateIcon } from '@phosphor-icons/react/dist/ssr/Certificate';
import { Copy as CopyIcon } from '@phosphor-icons/react/dist/ssr/Copy';
import { client } from "@/app/client";
import { getContract, prepareContractCall } from "thirdweb";
import { base, baseSepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount, useReadContract, useSendTransaction, TransactionButton, MediaRenderer } from "thirdweb/react"
import { PBACERT, getActiveChain } from "@/app/constants/contracts";
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';
import { upload, download, resolveScheme } from "thirdweb/storage";
import { keccak256 } from 'js-sha3';
import { generateCertificates } from '@/components/certificate/generate-certificate';
import * as XLSX from 'xlsx';

const certificateCategories = [
  { value: 'Bootcamp', label: 'Bootcamp' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Training', label: 'Training' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
] as const;

const certificateTemplates = [
  { value: 'test-pba-bootcamp', label: 'Test' },
  // { value: 'test-pba-bootcamp', label: 'PBA Bootcamp' },
  { value: 'test-lisk-bootcamp', label: 'Lisk Bootcamp' },
  { value: 'test-icp-bootcamp', label: 'ICP Bootcamp' },
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

export function BatchIssueCertificateForm(): React.JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  // const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [imageHash, setImageHash] = useState<string | null>(null);
  const [pdfHash, setPDFHash] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [excelData, setExcelData] = useState<object[] | unknown[] | null>(null);

  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (event.target?.result) {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);

        if (sheetData.length > 0) {
          const newRows = await Promise.all(sheetData.map(async (row: any, index: number) => {
            const id = await generateRandomCertificateId();
            return {
              ...row,
              fullName: row['full_name'] || '',
              walletAddress: row['wallet_address'] || '',
              certificateId: convertToHex(id),
              certificateIdNumber: BigInt(id),
              fileHash: null,
              dataHash: ''
            };
          }));

          setRows(newRows);
        }
        
      }
    };

    reader.readAsBinaryString(file);
  };


  const handlePDFFileChange = (event: any, index: number) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      let targetIndex: number = index;
      reader.onload = async (e) => {
        // Generate PDF hash
        const response = await fetch(e.target?.result as string);
        const arrayBuffer = await response.arrayBuffer();
        const hash = keccak256(arrayBuffer);
        // console.log(hash);

        let tempRows = rows;
        // console.log(targetIndex);
        // console.log(tempRows);
        tempRows[targetIndex].fileHash = hash;
        // console.log(tempRows);
        setRows(tempRows);
        setTestBool(!testBool);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
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
    }
  };

  const contract = getContract({
    client,
    chain: getActiveChain(),
    address: PBACERT,
  });

  const DEFAULT_ROW_OBJECT = { fullName: '', walletAddress: '', certificateId: '', certificateIdNumber: BigInt(0), fileHash: null, dataHash: '' };

  type Row = {
    fullName: string;
    walletAddress: string;
    certificateId: string;
    certificateIdNumber: bigint;
    fileHash: string | null;
    dataHash: string;
  }

  const [rows, setRows] = useState<Row[]>([
    DEFAULT_ROW_OBJECT
  ]);

  const handleAddRow = () => {
    generateRandomCertificateId().then((id) => {
      let tempRow = { fullName: '', walletAddress: '', certificateId: convertToHex(id), certificateIdNumber: BigInt(id), fileHash: null, dataHash: '' };
      setRows([...rows, tempRow]);
      // console.log("--- handleAddRow");
    });
  };

  const handleRemoveRow = (index: Number) => {
    const updatedRows = rows.filter((row, i) => i !== index);
    setRows(updatedRows);
    // console.log("--- handleRemoveRow");
  };

  const handleInputChange = (index: Number, field: string, value: string | BigInt) => {
    // console.log("handleInputChange triggered");
    // console.log("rows before:");
    // console.log(rows);
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    // console.log("rows after:");
    // console.log(updatedRows);
    setRows(updatedRows);
    // console.log("--- handleInputChange");
  };

  const [fullName, setFullName] = useState("Jason Yapri");
  const [walletAddress, setWalletAddress] = useState("0xD86399B0D9ac3a9A7fCFc1dd90c67Ece2792Fbe7");
  const [certificateName, setCertificateName] = useState("Blockchain Developer Bootcamp");
  const [issuer, setIssuer] = useState("Pelita Bangsa Academy");
  const [certificateCategory, setCertificateCategory] = useState("Bootcamp");
  const [certificateTemplate, setCertificateTemplate] = useState("test-pba-bootcamp");
  const [certificateType, setCertificateType] = useState("Certificate of Completion");
  const [cohort, setCohort] = useState(1);
  const [duration, setDuration] = useState("21 sessions");
  const [startDate, setStartDate] = useState("June 11, 2024");
  const [endDate, setEndDate] = useState("August 29, 2024");
  const [instructor1, setInstructor1] = useState("Jason Yapri");
  const [instructor2, setInstructor2] = useState("Yevonnael Andrew");
  const [externalUrl, setExternalUrl] = useState("https://www.pelitabangsa.co.id/bootcamp");
  const [certificateId, setCertificateId] = useState("0000000000");
  const [certificateIdNumber, setCertificateIdNumber] = useState<bigint>(BigInt(0));
  const [testBool, setTestBool] = useState(false);
  const [description, setDescription] = useState("This is to certify that the bearer has successfully completed a 3-month online bootcamp that covers Blockchain and Cryptography Fundamentals, EVM, Solidity Smart Contract Development, Advanced Patterns, Testing, Gas Optimization, Yul, Security, Deployment, Frontend Integration and Professional Development.");

  const certificateIdNumberTemp = useRef(BigInt(0));

  const { data: certificateIdExists, isLoading, refetch, error } = useReadContract({
    contract,
    method: "function certificateIds(uint256) view returns (bool)",
    params: [certificateIdNumberTemp.current]
  });

  const uploadFileToIpfs = async () => {
    if (!file) {
      return Promise.reject(new Error("File is not selected yet."));
    }

    try {
      const uri = await upload({
        client,
        uploadWithoutDirectory: true,
        files: [file],
      });
      // console.warn(uri);
      return uri;
    } catch (error) {
      // console.error("Upload error", error);
      throw error;
    }
  };

  const convertToHex = (id: Number) => {
    return id.toString(16).padStart(10, '0').toUpperCase();
  };

  const generateRandomCertificateId = async (): Promise<number> => {
    let found: boolean = false;
    let randomIdNumber = Math.floor(Math.random() * 1099511627776);
    while (!found) {
      randomIdNumber = Math.floor(Math.random() * 1099511627776);

      // Check if the certificate ID already used or not inside rows.certificateIdNumber
      if (rows.some((row) => row.certificateIdNumber === BigInt(randomIdNumber))) {
        continue;
      }

      certificateIdNumberTemp.current = BigInt(randomIdNumber);
      // console.log("certificateIdExists: ", certificateIdExists);
      const result = await refetch();
      // if (result !== undefined) {
        // console.info("Result");
        // console.info(result);
      // } else {
      //   console.error("Refetch did not return data");
      // }
      // console.log("certificateIdExists: ", certificateIdExists);
      if (certificateIdExists) {
        // console.log("exists, so regenerating...");
        continue;
      } else{
        // console.log("doesn't exists, so stop generating...");
        found = true;
        return randomIdNumber;
      }
    }

    return 0;
  };

  const refreshRandomCertificateId = () => {
    generateRandomCertificateId().then((id) => {
      // setCertificateIdNumber(BigInt(id));
      // setCertificateId(convertToHex(id));
      let tempRows = rows;
      tempRows[0].certificateIdNumber = BigInt(id);
      tempRows[0].certificateId = convertToHex(id);
      setRows(tempRows);
    });
  };


  useEffect(() => {
    refreshRandomCertificateId();
  }, []);

  // const testFunction = async () => {
  //   console.log("refetching...");
  //   setCertificateIdNumber(BigInt(Math.floor(Math.random() * 1099511627776)));
  //   await refetch();
  //   console.log("refetch done!");
  // }

  const resetRecipients = () => {
    generateRandomCertificateId().then((id) => {
      let tempRows = [DEFAULT_ROW_OBJECT];
      tempRows[0].certificateIdNumber = BigInt(id);
      tempRows[0].certificateId = convertToHex(id);
      setRows(tempRows);
      setTestBool(!testBool);
      // console.log('--- resetRecipients')
    });
  }

  const downloadCertificates = () => {
    rows.forEach((row) => {
      const { fullName, certificateId } = row;
      if (fullName && certificateId) {
        generateCertificates(fullName, certificateId, certificateTemplate);
      }
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        console.log(json);
        // Process the JSON data as needed
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const importBearers = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
            <Grid md={12} xs={12}>
            <FormControl fullWidth>
                <InputLabel>Certificate Template</InputLabel>
                <Select label="Certificate Template" name="certificateTemplate" variant="outlined" value={certificateTemplate} onChange={(e) => setCertificateTemplate(e.target.value)}>
                  {certificateTemplates.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
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
                Upload NFT Image
                <VisuallyHiddenInput
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                  // multiple
                />
              </Button> &nbsp;{file && `${file.name}`}
            </Grid>
            <Grid md={12} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Description</InputLabel>
                <OutlinedInput label="Description" name="description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </FormControl>
            </Grid>
            { rows.map((row, index) => (
              <>
                <Grid md={3} xs={12}>
                  <ButtonGroup variant="outlined" aria-label="Basic button group">
                    <Button disabled={true}>{ index+1 }</Button>
                    <FormControl fullWidth required>
                      <InputLabel>Full name</InputLabel>
                      <OutlinedInput label="Full name" name="fullName" value={row.fullName} onChange={(e) => handleInputChange(index, 'fullName', e.target.value)} />
                    </FormControl>
                  </ButtonGroup>
                </Grid>
                <Grid md={3} xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Wallet address</InputLabel>
                    <OutlinedInput label="Wallet address" name="walletAddress"  value={row.walletAddress} onChange={(e) => handleInputChange(index, 'walletAddress', e.target.value)} />
                  </FormControl>
                </Grid>
                <Grid md={3} xs={12}>
                  <ButtonGroup variant="outlined" aria-label="Basic button group">
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CertificateIcon />}
                      color='secondary'
                    >
                      <VisuallyHiddenInput
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handlePDFFileChange(e, index)}
                        // multiple
                      />
                    </Button>
                    <OutlinedInput
                      value={row.fileHash && `${row.fileHash.substring(0, 5)}........${row.fileHash.substring(row.fileHash.length - 5)}`}
                      disabled={true}
                      placeholder="PDF Hash"
                    />
                    <Button onClick={() => {if (row.fileHash){ navigator.clipboard.writeText(row.fileHash); toast.info("Certificate PDF File Hash Copied to clipboard") }}} disabled={row.fileHash == null ? true : false}><CopyIcon /></Button>
                  </ButtonGroup>
                </Grid>
                <Grid md={3} xs={12}>
                  <ButtonGroup variant="outlined" aria-label="Basic button group">
                    <FormControl fullWidth required>
                      <InputLabel>Certificate ID</InputLabel>
                      <OutlinedInput label="Certificate ID" name="certificateId" value={row.certificateId} disabled={true} />
                      {/* <div>{certificateIdExists == undefined ? "undefined" : (certificateIdExists == true ? 'true' : 'false')}</div>
                      <div>Error: {JSON.stringify(error)}</div>
                      <Button onClick={testFunction}>Refetch</Button> */}
                    </FormControl>
                    <LoadingButton sx={{ p: 2 }} color='error' loadingPosition="start" variant="contained" onClick={() => { if (rows.length > 1) handleRemoveRow(index) }} disabled={rows.length <= 1}>
                      <TrashIcon />
                    </LoadingButton>
                  </ButtonGroup>
                  <div>{index == (rows.length-1) ? (isLoading ? "Generating Certificate ID..." : "") : ""}</div>
                </Grid>
              </>
            ))}
            <Grid md={12} xs={12}>
              {/* <Button variant="contained" onClick={() => handleAddRow()} disabled={isLoading}>Add Recipient</Button> */}
              {/* {rows[0] ? JSON.stringify(rows[0].fileHash) : ""} */}
              <Box display="flex" gap={2}>
                <Button variant="contained" onClick={() => handleAddRow()} disabled={isLoading}>Add Recipient</Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={importBearers}
                  disabled={isLoading || rows.length === 0}
                >
                  Import Bearers
                </Button> 
                <Button
                  variant="contained"
                  color="info"
                  onClick={downloadCertificates}
                  disabled={isLoading || rows.length === 0}
                >
                  Load and Download Certificates
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        {/* {excelData && (
          <div>
            <h2>Imported Data:</h2>
            <pre>{JSON.stringify(excelData, null, 2)}</pre>
          </div>
        )} */}
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {/* <Button type="submit" variant="contained" disabled={isLoadingIssue}>Issue Certificate</Button> */}
          <TransactionButton
            type="submit"
            transaction={async () => {
              if (!file) {
                // console.error("File is not uploaded yet.");
                return Promise.reject(new Error("NFT Image is not uploaded yet!"));
              }

              const fileSize = file.size;
              const fileType = file.type;

              if (file.type !== "image/jpeg" && file.type !== "image/png") {
                return Promise.reject(new Error("NFT Image should be an image!"));
              }

              const imageURI = await uploadFileToIpfs();
              const resolvedImageURL = resolveScheme({
                client,
                uri: imageURI,
              });
              // console.warn("imageUri", imageURI);
              // console.warn("imageURL", resolvedImageURL);

              let walletAddresses: string[] = [];
              let tokenURIs: string[] = [];
              let certificateIds: bigint[] = [];
              let dataHashes: `0x${string}`[] = [];
              let pdfHashes: `0x${string}`[] = [];

              let index = 0;
              for (let row of rows) {

                if (row.fileHash == null || row.fileHash == "") {
                  return Promise.reject(new Error("Certificate PDF File Hash should be generated!"));
                }

                const tokenMetadata = {
                  "name": certificateName,
                  "created_by": issuer,
                  "external_url": externalUrl,
                  "description": description,
                  "attributes": [
                    {
                        "trait_type": "Certificate ID",
                        "value": row.certificateId
                    },
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
                        "value": row.fullName
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
                  "image": resolvedImageURL,
                  "image_url": resolvedImageURL
                };
                // console.warn("tokenMetadata");
                // console.warn(tokenMetadata);
                const dataHash = keccak256(JSON.stringify(tokenMetadata));
  
                const _tokenURI = await upload({
                    client,
                    uploadWithoutDirectory: true,
                    files: [tokenMetadata]
                });
                
                // const tokenURL = resolveScheme({
                //   client,
                //   uri: _tokenURI,
                // });
  
                // console.warn("_tokenURI", _tokenURI);
                // console.warn("tokenURL", tokenURL);

                walletAddresses.push(row.walletAddress);
                tokenURIs.push(_tokenURI);
                certificateIds.push(row.certificateIdNumber);
                dataHashes.push(`0x${dataHash}`);
                pdfHashes.push(`0x${row.fileHash}`); // pdf
                index++;
              };
              // console.log(certificateIds);

              const tx = prepareContractCall({ 
                contract, 
                method: "function batchIssueCertificates(address[] studentAddresses, string[] tokenURIs, uint256[] _certificateIds, bytes32[] dataHash, bytes32[] fileHash)", 
                params: [walletAddresses, tokenURIs, certificateIds, dataHashes, pdfHashes] 
              });
              return tx;
            }}
            onTransactionSent={(result) => {
              resetRecipients();
              toast.info("Issuing certificate...");
            }}
            onTransactionConfirmed={(receipt) => {
              // console.log("Transaction confirmed", receipt.transactionHash);
              toast.success(
                <div>
                  Certificates issued. Tx Hash:{' '}
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
            disabled={isLoading || certificateIdExists || file == null}
          >
            Batch Issue Certificate
          </TransactionButton>
          {/* <Button onClick={() => resetRecipients()}>Reset Recipients</Button>
          <Button onClick={() => console.log(rows)}>LogRows</Button> */}
          {/* <Button
            onClick={() => {
              uploadFileToIpfs().then((uri) => {
                // console.log(uri);
                setCurrentUri(uri);
              }).catch((error) => {
                toast.error("Upload error", error);
              });
            }}
          >Upload to IPFS</Button> */}
          {/* <Button onClick={async () => {
            const response = await download({
              client,
              uri: "ipfs://QmaWZwvhgU9yQokQ334eVJFy6615jqdSnSXzh7NAfm3egC/thumbnail.jpg",
            });
            const url = response.url;
            setImageUrl(url);
          }}>
            Download URL
          </Button> */}
        </CardActions>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleExcelFileUpload}
        />
      </Card>
    </form>
  );
}
