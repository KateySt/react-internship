import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
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

const PhotoUpload: React.FC<{ setPhotoData: (file: File | null) => void }> = ({ setPhotoData }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoData(file);
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      startIcon={<CloudUploadIcon />}>
      Upload Photo
      <VisuallyHiddenInput type="file" onChange={handleFileChange} />
    </Button>
  );
};

export default PhotoUpload;