import React from 'react';
import { Typography, TextField, Grid, Paper } from '@mui/material';
import { FaMoneyBillWave, FaParking, FaFileContract } from 'react-icons/fa';

interface PricingPolicyProps {
  pricing: {
    cleaningFee?: number;
    parking?: string;
    cancellationPolicy?: string;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PricingPolicySection: React.FC<PricingPolicyProps> = ({
  pricing,
  isEditing,
  onInputChange
}) => {
  return (
    <section className="mb-8">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaMoneyBillWave className="mr-2 text-indigo-600" /> 料金・ポリシー
      </Typography>
      <Grid container spacing={3}>
        {isEditing ? (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                name="cleaningFee"
                label="清掃料金"
                type="number"
                value={pricing.cleaningFee || ''}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                name="parking"
                label="駐車場"
                value={pricing.parking || ''}
                onChange={onInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="cancellationPolicy"
                label="キャンセルポリシー"
                value={pricing.cancellationPolicy || ''}
                onChange={onInputChange}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Paper className="p-4 bg-white shadow-md">
                <Typography variant="subtitle1" className="font-semibold flex items-center">
                  <FaMoneyBillWave className="mr-2 text-indigo-600" /> 清掃料金
                </Typography>
                <Typography>¥{pricing.cleaningFee?.toLocaleString()}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper className="p-4 bg-white shadow-md">
                <Typography variant="subtitle1" className="font-semibold flex items-center">
                  <FaParking className="mr-2 text-indigo-600" /> 駐車場
                </Typography>
                <Typography>{pricing.parking}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className="p-4 bg-white shadow-md">
                <Typography variant="subtitle1" className="font-semibold flex items-center">
                  <FaFileContract className="mr-2 text-indigo-600" /> キャンセルポリシー
                </Typography>
                <Typography>{pricing.cancellationPolicy}</Typography>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </section>
  );
};

export default PricingPolicySection;