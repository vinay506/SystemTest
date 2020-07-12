import { Subject } from 'rxjs';

const modalSubject = new Subject();
const formDataSubject  = new Subject();
const notificationSubject = new Subject();
const setNotifiction=(open,type,action) => {
    console.log('setNotificaion::',open,type,action);
    notificationSubject.next({ open:open,type:type ,action:action})
}
export const ModalService = {
    setModalVisibility: (status,action) => modalSubject.next({ open:status,action:action }),
    getModalVisibility: () => modalSubject.asObservable(),
    setFormData:Data => formDataSubject.next(Data),
    getFormData:() => formDataSubject.asObservable(),
    setNotificationVisibility: (open,type,action) => setNotifiction(open,type,action),
    getNotificationVisibility: () => notificationSubject.asObservable()    
    
};
