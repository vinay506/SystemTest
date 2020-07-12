import { Subject } from 'rxjs';
const uuid = require('uuid');
const gridDataSubject = new Subject();
const searchKeySubject = new Subject();
const groupBySubject = new Subject();

const getData = () => {
    const localData = localStorage.getItem('rowData');
    if (!localData || localData === 'undefined') {
        const data = [
            { id: uuid(),currentState:'Open', title: "Toyota", priority: "High", description: 'Toyata', createdAt: '2020-07-10', dueDate: '2020-07-10' },
            { id: uuid(),currentState:'Open', title: "Ford", priority: "High", description: 'Ford', createdAt: '2020-07-10', dueDate: '2020-07-10' },
            { id: uuid(),currentState:'Open', title: "Audy", priority: "High", description: 'Audy', createdAt: '2020-07-10', dueDate: '2020-07-10' },
            { id: uuid(),currentState:'Open', title: "Benz", priority: "High", description: 'Benz', createdAt: '2020-07-10', dueDate: '2020-07-10' },
            { id: uuid(),currentState:'Done', title: "Porsche", priority: "High", description: 'Porsche', createdAt: '2020-07-10', dueDate: '2020-07-10' },
            { id: uuid(),currentState:'Open', title: "Bently", priority: "High", description: 'Porsche', createdAt: '2020-07-10', dueDate: '2020-07-10' },
            { id: uuid(),currentState:'Done', title: "Creta", priority: "High", description: 'Porsche', createdAt: '2020-07-10', dueDate: '2020-07-10' },
            { id: uuid(),currentState:'Open', title: "Brezza", priority: "High", description: 'Porsche', createdAt: '2020-07-10', dueDate: '2020-07-10' },
            { id: uuid(),currentState:'Open', title: "Scorpio", priority: "High", description: 'Porsche', createdAt: '2020-07-10', dueDate: '2020-07-10' },
            { id: uuid(),currentState:'Open', title: "Bolero", priority: "High", description: 'Porsche', createdAt: '2020-07-10', dueDate: '2020-07-10' },
            { id: uuid(),currentState:'Open', title: "Polo", priority: "High", description: 'Porsche', createdAt: '2020-07-10', dueDate: '2020-07-10' }];
        localStorage.setItem('rowData', JSON.stringify(data));
        return data;
    } else {
        return JSON.parse(localData);
    }
}


const gridData = {
    rowData: getData(),
    filters: []
};

function getIndex(id) {
    const index = gridData.rowData.findIndex(record => {
        return record.id === id;
    });
    return index;
}

function updateToStorage() {
    localStorage.setItem('rowData', JSON.stringify(gridData.rowData));
}

const GridService = {
    setGroupBy:groupBy => groupBySubject.next(groupBy),
    getGroupBy:()=>groupBySubject.asObservable(),
    searchBasedOnkey:str => searchKeySubject.next(str),
    observsSearchKey:()=>searchKeySubject.asObservable(),
    setGridData: Data => gridDataSubject.next(Data),
    gridData: () => gridDataSubject.asObservable(),
    getRowData: () => {
        const data = localStorage.getItem('rowData');
        if (data) {
            return JSON.parse(data);
        } else {
            return gridData.rowData
        }

    },
    getFilters: () => {
        return gridData.filters;
    },
    addRecord: (record) => {
        const obj = {
            ...record,
            ...{id: uuid()}
        }
        gridData.rowData.push(obj);
        updateToStorage();
        GridService.setGridData({data:obj,action:'ADD'});
    },
    deleteRecord: (record) => {
        const index = getIndex(record.id);
        if (index !== -1) {
            GridService.setGridData({data:gridData.rowData[index],action:'DELETE'});
            gridData.rowData.splice(index, 1);
            updateToStorage();
        }
    },
    updateRecord: (record) => {
        const index = getIndex(record.id);
        gridData.rowData[index] = Object.assign(gridData.rowData[index], record);
        GridService.setGridData({data:gridData.rowData[index],action:'UPDATE'});
        updateToStorage()
    }

}

export default GridService;

