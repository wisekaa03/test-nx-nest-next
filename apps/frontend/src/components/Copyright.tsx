import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{
        color: 'text.secondary',
      }}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://wisekaa.dev/">
        wisekaa.dev
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}
