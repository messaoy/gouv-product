import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import StatusBadge from './StatusBadge';

export default function ServiceDetails() {
  const location = useLocation();
  return (
      <Paper sx={{ padding: '16px', textAlign: 'left' }}>
          <Grid container spacing={2}>
              <Grid item xs={8}>
                  <Typography variant="h3">{location.state.title}</Typography>
                  <Markdown remarkPlugins={[remarkGfm]}>{location.state.content}</Markdown>
              </Grid>
              <Grid item xs={4}>
                  <Paper variant="elevation" elevation={4} sx={{ padding: '1rem', textAlign: 'left' }}>
                    <Typography sx={{ display: 'inline-block' }} variant="h6">Statut:</Typography>
                      <StatusBadge serviceStatus={location.state.status} />
                  </Paper>
                  <Paper variant="elevation" id="detailPaper" elevation={4}>
                      <Typography sx={{ display: 'inline-block' }} variant="h6">Fiche technique:</Typography>
                      <Markdown remarkPlugins={[remarkGfm]}>{location.state.details}</Markdown>
                  </Paper>
              </Grid>
          </Grid>
    </Paper>
  );
}
