import * as React from 'react';
import {DataGrid, GridColDef, GridRenderCellParams, GridRowsProp} from '@mui/x-data-grid';
import {Service} from "../types/Service";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const apiUrl: string = process.env.REACT_APP_SERVER_API_URL ?
    process.env.REACT_APP_SERVER_API_URL : 'http://localhost:8080';

const columns: GridColDef[] = [
    {
        field: 'title',
        headerName: 'Services',
        description: 'Noms des services.',
        sortable: false,
        width: 550,
        // on pourrait utiliser le slug, il est présent dans l'objet actuellement mais pas pour tout les services
        renderCell: (params: GridRenderCellParams) => (<Link to={`/service/${params.row.id}`} state={{content: params.row.content, status: params.row.status}}> {params.value}</Link>)
    },
    {
        field: 'status',
        headerName: 'Statut',
        description: 'Statut des services.',
        width: 150
    },
];

export default function DataTable() {
    const [services, setService] = useState([{id: 0}])

    useEffect(() => {
        const fetchData = async () => {
            const apiResponse = await fetch(apiUrl);

            const dataResult: Service[] = await apiResponse.json();
            if (!apiResponse || !dataResult) {
                return;
            }
            setService(dataResult);
        };

        fetchData().catch(console.error);
    }, []);

    return (
        <div style={{height: 400, width: '100%'}}>
            <DataGrid
                rows={services as GridRowsProp<any>}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 5},
                    },
                }}
                pageSizeOptions={[5, 10]}
                // La version pro permettrait l'affichage des détails directement dans la liste..
            />
        </div>
    );
}
