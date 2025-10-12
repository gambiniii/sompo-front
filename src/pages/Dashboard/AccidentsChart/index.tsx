import { Red } from '@/shared/colors/red';
import { getMonthlyAccidents } from '@/shared/http/sompo-api/dashboard/get-monthly-accidents';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

interface MonthlyAccident {
  month: string; // "YYYY-MM"
  count: number;
}

export const AccidentsChart = () => {
  const [accidentsData, setAccidentsData] = useState<MonthlyAccident[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMonthlyAccidents();

        // Ordena do mais recente para o mais antigo
        const sortedData = data.sort((a, b) => (a.month < b.month ? 1 : -1));

        // Pega os últimos 12 meses e reverte para exibir do mais antigo ao mais recente
        const last12Months = sortedData.slice(0, 12).reverse();

        setAccidentsData(last12Months);
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
      <h3>Acidentes por Mês</h3>
      <BarChart width={500} height={300} data={accidentsData} style={{ margin: 'auto' }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill={Red.BASE} />
      </BarChart>
    </div>
  );
};
