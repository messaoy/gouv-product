import { Badge } from '@mui/material';
import * as React from 'react';
export default function StatusBadge(props: { serviceStatus: string }) {
  const serviceStatus = props.serviceStatus;
  return (
      <Badge sx={{ paddingLeft: '1.5rem' }} color={serviceStatus === 'up' ?
        'success' : (serviceStatus === 'n/a' ? 'warning' : 'error')}
             badgeContent={serviceStatus} />
  );
}
