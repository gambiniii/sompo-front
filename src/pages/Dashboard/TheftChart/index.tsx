import { Blue } from '@/shared/colors/blue';
import { getMonthlyThefts } from '@/shared/http/sompo-api/dashboard/get-monthly-thefts';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

interface MonthlyTheft {
  month: string; // "YYYY-MM"
  count: number;
}

export const TheftChart = () => {
  const [theftsData, setTheftsData] = useState<MonthlyTheft[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMonthlyThefts();

        // Ordena do mais recente para o mais antigo
        const sortedData = data.sort((a, b) => (a.month < b.month ? 1 : -1));

        // Pega os últimos 12 meses
        const last12Months = sortedData.slice(0, 12).reverse(); // reverse para ficar do mais antigo ao mais recente

        setTheftsData(last12Months);
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar dados');
      }
    };

    loadData();
  }, []);

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3>Roubos por Mês</h3>
      <BarChart width={500} height={300} data={theftsData} style={{ margin: 'auto' }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill={Blue.STRONG_BLUE} />
      </BarChart>
    </div>
  );
};
