import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import { Service } from '../types/Service';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatusBadge from './StatusBadge';

const apiUrl: string = process.env.REACT_APP_SERVER_API_URL ?
  process.env.REACT_APP_SERVER_API_URL : 'http://localhost:8080';

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Services',
    description: 'Noms des services.',
    sortable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams) =>
      (<Link to={`/service/${params.row.id}`} state={{ content: params.row.content, title: params.value, status:
        params.row.status, details: params.row.details }}> {params.value}</Link>),
  },
  {
    field: 'status',
    headerName: 'Statut',
    description: 'Statut des services.',
    renderCell: (params: GridRenderCellParams) =>
      (<StatusBadge serviceStatus={params.value} />),
    flex: 1,
    maxWidth: 100,
  },
];

export default function DataTable() {
  const [services, setService] = useState([{ id: 0 }]);

  useEffect(() => {
    const fetchData = async () => {
      const apiResponse = await fetch(apiUrl);

      const dataResult: Service[] = await apiResponse.json();
      if (!apiResponse || !dataResult || apiResponse.status !== 200) {
        toast.error('Erreur lors de la récupération de la liste des services numériques');
        return;
      }
      setService(dataResult);
      toast.success('La liste des services numériques est à jour !');
    };

    fetchData().catch(console.error);
  }, []);

  return (
        <div style={{ height: 400, width: '100%' }}>
          <ToastContainer />
            <DataGrid
                rows={services as GridRowsProp<any>}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                disableRowSelectionOnClick={true}
                pageSizeOptions={[5, 10]}
                // La version pro permettrait l'affichage des détails directement dans la liste..
            />
        </div>
  );
}
