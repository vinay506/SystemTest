import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import GridService from '../Service/GridService';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import { ModalService } from '../Service/ModalService';
import messages from '../Service/DailogBoxConstants';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import Button from '@material-ui/core/Button';

const AgGrid = (props) => {

    let gridApi;
    let columnApi;
    let paramsObj;
    const deleteRecord = params => {
        if (window.confirm(messages['CONFIRMATION'])) {
            GridService.deleteRecord(params.data);
        }
    }

    const editModal = (params) => {
        ModalService.setModalVisibility(true, 'EDIT');
        ModalService.setFormData(params.data);
        refreshGridRowData(params)
    }

    const changeState = (params) => {
        let obj = params.data;
        obj.currentState = obj.currentState === 'Open' ? 'Done' : 'Open';
        GridService.updateRecord(obj);
        refreshGridRowData(params);
        updateGrid(params);
    }

    const updateGrid = (params) => {
        if (props.currentTab !== 'All') {
            gridApi.updateRowData({
                remove: [params.data]
            })
        }

    }

    const getButtonText = (params) => {
        if(!params || !params.data) return 'Open';
        return params.data.currentState === 'Open' ? 'Done' : 'Open';
    }

    const actionTemplate = (params) => {
        return <div className="gridActions">
            <VisibilityIcon onClick={() => { viewRecord(params) }}></VisibilityIcon>
            <EditIcon onClick={() => editModal(params)}></EditIcon>
            <DeleteIcon onClick={() => deleteRecord(params)}></DeleteIcon>
            <Button className="statusButton" onClick={() => { changeState(params) }}>{getButtonText(params)}</Button>
        </div>
    }

    const viewRecord = (params) => {
        ModalService.setModalVisibility(true, 'VIEW');
        ModalService.setFormData(params.data);
    }

    const getRowNodeId = function (data) {
        return data.id;
    }

    const [modules, setModules] = useState([ClientSideRowModelModule,
        RowGroupingModule])

    const [columnDefs, setcolumnDefs] = useState([
        { headerName: 'id', field: 'id', hide: true },
        { headerName: 'currentState', field: 'currentState', hide: true },
        {
            headerName: "Summary", field: "title",
            sortable: true,
            getQuickFilterText: function (params) {
                return params.value;
            }
        },
        { headerName: "Priority", field: "priority", sortable: true },
        {
            headerName: "Description", field: "description",
            sortable: true,
            getQuickFilterText: function (params) {
                return params.value;
            }
        },
        { headerName: "Created On", field: "createdAt", sortable: true },
        { headerName: "Due date", field: "dueDate", sortable: true },
        {
            headerName: "Actions", field: "",
            cellRendererFramework: actionTemplate
        }
    ]);

    const getFilteredRowData = () => {
        const data = GridService.getRowData();
        switch (props.currentTab) {
            case 'Completed':
                return data.filter(row => row.currentState === 'Done');
            case 'Pending':
                return data.filter(row => row.currentState === 'Open');
            default:
                return data;
        }
    }
    const [rowData, setRowData] = useState(getFilteredRowData());
    const [rerender,setRerender] = useState(false);

    useEffect(() => {
        GridService.gridData().subscribe(response => {
            if (gridApi) {
                switch (response.action) {
                    case 'UPDATE':
                        gridApi.updateRowData({
                            update: [response.data]
                        })
                        ModalService.setNotificationVisibility(true, 'ALERT', 'UPDATE');
                        break;
                    case 'ADD':
                        gridApi.updateRowData({
                            add: [response.data]
                        })
                        ModalService.setNotificationVisibility(true, 'ALERT', 'ADD');
                        break;
                    case 'DELETE':
                        gridApi.updateRowData({
                            remove: [response.data]
                        });
                        ModalService.setNotificationVisibility(true, 'ALERT', 'DELETE');
                }
            }

        });
        GridService.observsSearchKey().subscribe(response => {
            if (gridApi) {
                if (response) {
                    gridApi.setQuickFilter(response)
                } else {
                    gridApi.setQuickFilter('')
                }
            }
        })
        GridService.getGroupBy().subscribe(response => {
            const defs = columnDefs.map(obj => {
                if (obj.field === response) {
                    obj.rowGroup = true
                    return obj;
                }
                if (obj.rowGroup) {
                    obj.rowGroup = false;
                }
                return obj
            });
            setcolumnDefs(defs);
            setRerender(true);
            setTimeout(() =>{
                setRerender(false);
            },5)
        })
    });

    const onGridReady = (params) => {
        paramsObj = params;
        gridApi = params.api;
        columnApi = params.columnApi;
    }

    const getRowStyleScheduled = (params) => {
        if (params && params.data &&  params.data.currentState === 'Done') {
            return {
                'background-color': '#32CD32'
            }
        }
        return {
            'background-color': '#ffffff'
        }
    }
    const refreshGridRowData = (params) => {
        var rowNode = gridApi.getRowNode(params.data.id);
        var params = {
            force: true,
            suppressFlash: true,
            rowNodes: [rowNode],
        };
        setTimeout(function () {
            gridApi.refreshCells(params);
        }, 100);
    }

    return (
        <div className="ag-theme-alpine" style={{ height: '500px', width: '1220px' }}>
            {!rerender && <AgGridReact 
                modules={modules}
                onGridReady={params => onGridReady(params)}
                columnDefs={columnDefs}
                rowData={rowData}
                getRowNodeId={getRowNodeId}
                animateRows={true}
                autoGroupColumnDef={{ minWidth: 200 }}
                getRowStyle={getRowStyleScheduled}
                enableCellChangeFlash={true}
            >
            </AgGridReact>}
        </div>
    );
}


export default AgGrid;