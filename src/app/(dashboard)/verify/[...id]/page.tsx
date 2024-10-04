'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Certificate as CertificateIcon } from '@phosphor-icons/react/dist/ssr/Certificate';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import { useState, useEffect, useRef, MutableRefObject } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import ButtonGroup from '@mui/material/ButtonGroup';
import LoadingButton from '@mui/lab/LoadingButton';
import { getContract, prepareContractCall } from "thirdweb";
import { Copy as CopyIcon } from '@phosphor-icons/react/dist/ssr/Copy';
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
import { config } from '@/config';
import { keccak256 } from 'js-sha3';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation'

type Attribute = {
  trait_type: string;
  value: string | number;
  display_type?: string;
};

type ParamsType = {
  id?: string[];
};

import { styled } from '@mui/material/styles';
import { margin } from '@mui/system';

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

export default function Page(): React.JSX.Element {

  const params = useParams<ParamsType>()

  const [certificateId, setCertificateId] = useState('');
  const [lastTriggeredCertificateId, setLastTriggeredCertificateId] = useState('ZZZ'); // value that is impossible to input manually
  const [certificateIdNumber, setCertificateIdNumber] = useState(0);
  const [searchResult, setSearchResult] = useState(false);
  const [searched, setSearched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const certificateIdNumberParam: MutableRefObject<bigint> = useRef(BigInt(-1));

  useEffect(() => {
    if (certificateId == undefined || certificateId == "") {
      setCertificateIdNumber(0);
    } else{
      setCertificateIdNumber(parseInt(certificateId, 16));
    }
  }, [certificateId]);

  const contract = getContract({
    client,
    // chain: baseSepolia,
    chain: base,
    address: PBACERT,
  });

  // const { data: nextTokenId, isPending, status, isRefetching, refetch, fetchStatus, isLoading: isLoadingNextTokenId, isFetching, isSuccess } = useReadContract({
  //   contract,
  //   method: "function nextTokenId() view returns (uint256)",
  //   params: []
  // });

  const { data: certificateIdExists, isLoading: isLoadingCheckCertificateId, refetch: refetchCertificateId, isFetching: isFetchingCertificateId } = useReadContract({
    contract,
    method: "function certificateIds(uint256) view returns (bool)",
    params: [certificateIdNumberParam.current],
  });

  const certificateIdFileHash: MutableRefObject<`0x${string}`> = useRef('0x0');

  const { data: receivedTokenId, isPending: isPendingGetCertificateTokenIdBasedOnFileHash, isLoading: isLoadingGetCertificateTokenIdBasedOnFileHash, refetch: refetchGetCertificateTokenIdBasedOnFileHash, isFetching: isFetchingGetCertificateTokenIdBasedOnFileHash } = useReadContract({
    contract,
    method: "function getCertificateTokenIdBasedOnFileHash(bytes32 _certificateFileHash) view returns (uint256)",
    params: [certificateIdFileHash.current]
  });

  const DEFAULT_TOKEN_ID = BigInt(9999999999);

  const getCertificateTokenIdParam: MutableRefObject<bigint> = useRef(DEFAULT_TOKEN_ID);


  const { data: certificateTokenId, isLoading: isLoadingGetCertificateTokenId, refetch: refetchCertificateTokenId, isFetching: isFetchingCertificateTokenId } = useReadContract({
    contract,
    method: "function certificateTokenIdBasedOnCertificateId(uint256) view returns (uint256)",
    params: [getCertificateTokenIdParam.current]
  });

  const [certificate, setCertificate] = useState<any>(null);

  const processCertificate = (rawNft: any) => {
    // console.log("rawNft");
    // console.log(rawNft);
    if (rawNft) {
      const resolvedImageURL = resolveScheme({
        client,
        uri: rawNft.image || '',
      });
      rawNft.image_url = resolvedImageURL;
  
      const certAttributes: Attribute[] = rawNft.attributes;
  
      certAttributes.forEach((attribute) => {
        const key = camelCase(attribute.trait_type);
        rawNft[key] = attribute.value;
      });
      
      setLastTriggeredCertificateId(rawNft.certificateId);
      setCertificateId(rawNft.certificateId);
      setCertificate(rawNft);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
    const getNFTCertificate = async (_certificateTokenId: bigint) => {
      // console.log("fetching NFT");
      const nft = await getNFT({
        contract,
        tokenId: _certificateTokenId,
      });
      if (nft) processCertificate(nft.metadata);
    };

    if (!isFetchingCertificateTokenId) {
      if (certificateTokenId) {
        getNFTCertificate(certificateTokenId);
      } else{
        // console.log("getting certificateTokenId NO");
      }
    }
  }, [isFetchingCertificateTokenId]);

  useEffect(() => {
    if (!isFetchingCertificateId) {
      if (certificateIdExists) {
        // console.log("It exists");
        getCertificateTokenIdParam.current = certificateIdNumberParam.current;
        refetchCertificateTokenId();
      } else{
        getCertificateTokenIdParam.current = DEFAULT_TOKEN_ID;
        setIsLoading(false);
        setCertificate(null);
      }
    }
  }, [isFetchingCertificateId]);

  useEffect(() => {
    if (client) {
      // console.log(client);
      // console.log(params);
      if (params.id && params.id.length > 0) {
        setCertificateId(params.id[0].replace(/[^0-9a-fA-F]/g, '').toUpperCase());
      }
    }
  }, [client]);

  const searchCertificateById = async () => {
    // console.log("searchCertificateById starts");
    setSearched(true);
    setIsLoading(true);
    if (certificateId == undefined || certificateId == "") {
      // console.log("certificateId is empty");
      setIsLoading(false);
      setCertificate(null);
      return;
    }
    certificateIdNumberParam.current = BigInt(certificateIdNumber);
    await refetchCertificateId();
    setLastTriggeredCertificateId(certificateId);
    
    // console.log("searchCertificateById done");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const hexValue = value.replace(/[^0-9a-fA-F]/g, '').toUpperCase(); // Filter out non-hexadecimal characters
    setCertificateId(hexValue);
  };

  useEffect(() => {
    const getNFTCertificate = async (_certificateTokenId: bigint) => {
      // console.log("fetching NFT");
      const nft = await getNFT({
        contract,
        tokenId: _certificateTokenId,
      });
      processCertificate(nft.metadata);
    };

    if (!isFetchingGetCertificateTokenIdBasedOnFileHash) {
      console.log("receivedTokenId", receivedTokenId);
      if (receivedTokenId) {
        getNFTCertificate(receivedTokenId);
      } else{
        setIsLoading(false);
        setCertificate(null);
      }
    }
  }, [isFetchingGetCertificateTokenIdBasedOnFileHash]);
  
  const handlePDFFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        // Generate PDF hash
        const response = await fetch(e.target?.result as string);
        const arrayBuffer = await response.arrayBuffer();
        const hash = keccak256(arrayBuffer);
        certificateIdFileHash.current = `0x${hash}`;
        setSearched(true);
        setIsLoading(true);
        refetchGetCertificateTokenIdBasedOnFileHash();
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Verify</Typography>
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
            value={certificateId}
            onChange={handleInputChange}
            placeholder="Search Certificate by ID"
            disabled={isLoading}
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
              </InputAdornment>
            }
          />
          <LoadingButton sx={{ p: 2 }} loading={isLoading} loadingPosition="start" variant="contained" startIcon={(<MagnifyingGlassIcon />)} onClick={searchCertificateById} disabled={certificateId == lastTriggeredCertificateId || !client}>
            Verify
          </LoadingButton>
        </ButtonGroup>
        {/* <>
            <div>certificateId: {certificateId ? certificateId.toString() : "undefined"}</div>
            <div>certificateIdNumber: {certificateIdNumber ? certificateIdNumber.toString() : "undefined"}</div>
            <div>certificateIdNumberParam: {certificateIdNumberParam ? certificateIdNumberParam.toString() : "undefined"}</div>
            <div>certificateIdExists: {certificateIdExists ? "true" : "false"}</div>
        </> */}
        <Box sx={{ mx: 5, display: 'inline' }}> OR </Box>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CertificateIcon />}
          color='secondary'
          sx={{ p: 2 }}
          disabled={isLoading}
        >
          Upload PDF Certificate
          <VisuallyHiddenInput
            type="file"
            accept="application/pdf"
            onChange={handlePDFFileChange}
            // multiple
          />
        </Button>
        {/* {JSON.stringify(receivedTokenId?.toString())} */}
        {/* <Button onClick={() => {refetch()}}>Test</Button> */}
      </Card>
      <Card>
        {/* <div>nextTokenId: { nextTokenId == undefined ? "undefined" : nextTokenId.toString() }</div>
        <div>isPending: { isPending ? "true" : "false" }</div>
        <div>status: { JSON.stringify(status) }</div>
        <div>isRefetching: { isRefetching ? "true" : "false" }</div>
        <div>fetchStatus: { fetchStatus.toString() }</div>
        <div>isLoadingNextTokenId: { isLoadingNextTokenId ? "true" : "false" }</div>
        <div>isFetching: { isFetching ? "true" : "false" }</div>
        <div>isSuccess: { isSuccess ? "true" : "false" }</div> */}
      </Card>
      <Grid container spacing={3}>
        { searched ? (
          isLoading ? (
              <Grid lg={12} md={12} xs={12}><Alert severity="info" sx={{ marginBottom: 2 }}>Searching certificate on Blockchain...</Alert></Grid>
            ) : ((!certificate) ? (
              <Grid lg={12} md={12} xs={12}><Alert severity="error" sx={{ marginBottom: 2 }}>Certificate not found</Alert></Grid>
            ) : (
              <>
                <Grid lg={4} md={6} xs={12}>
                  <MediaRenderer client={client} src={certificate.image} />
                </Grid>
                <Grid lg={8} md={6} xs={12}> 
                  <MyCertificateDetail certificate={certificate} />
                </Grid>
              </>
            )
          )
        ) : (<></>)}
      </Grid>
    </Stack>
  );
}
