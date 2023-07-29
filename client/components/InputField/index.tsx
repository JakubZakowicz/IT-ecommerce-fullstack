import React from 'react';
import { TextField } from '@mui/material';

interface InputFieldProps {
  labelName?: string;
  [restProps: string]: any
}

const InputField = ({ labelName = 'Name', ...restProps }: InputFieldProps) => {
  return (
    <TextField
      id="outlined-basic"
      label={labelName}
      variant="outlined"
      fullWidth
      sx={{
        '& .MuiInputLabel-root': { color: 'white' },
        '& label.Mui-focused': {
          color: 'white',
        },
        '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
          color: 'white',
        },
        '& input': {
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        '& .MuiFormHelperText-root': {
          color: 'red',
          position: 'absolute',
          top: '60px',
          left: '-10px'
        }
      }}
      {...restProps}
    />
  );
};

export default InputField;
