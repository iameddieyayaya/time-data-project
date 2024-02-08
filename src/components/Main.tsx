import { Container, Box, Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import LineGraph from './LineGraph';
import DataTable from './DataTable';

const API = 'https://tsserv.tinkermode.dev';

interface MainProps {
}

const Main: React.FC<MainProps> = () => {
  const [data, setData] = useState<{ time: string; value: number; }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      if (!selectedDate) return

      const startDate = new Date(selectedDate);
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      const being = startDate.toISOString();
      const end = endDate.toISOString();

      const response = await fetch(`${API}/data?begin=${being}&end=${end}`);

      if (response.ok) {
        const data = await response.text();

        const formattedData = data
          .trim()
          .split('\n')
          .map((line) => {
            const [time, value] = line.split(/\s+/);
            return { time, value: parseFloat(value) };
          });

        setData(formattedData);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} justifyContent="flex-start">
            <Box display="flex" sx={{
              'input': { marginRight: 1 },
            }}>
              <input type="date" value={selectedDate} onChange={handleDateChange} />
              <Button variant="contained" onClick={fetchData} disabled={loading}>
                {loading ? 'Fetching...' : 'Fetch Data'}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} justifyContent="center">
            <LineGraph data={data} />
          </Grid>
          <Grid item xs={12}>
            <DataTable data={data} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Main;
