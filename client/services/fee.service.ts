import { AssignFee } from "@/interface";
import api from "./api";

export const assignFee = ({ classId, amount, term, year, startDate, dueDate } : AssignFee) => {
    return api.post('/fees/assign', { classId, amount, term, year, startDate, dueDate });
}

export const getFees = (term: number, year: number) => {
    return api.get('/fees', { params: { term, year } });
}

export const getUnpaidFeeForStudent = (studentId: string) => {
    return api.get(`/fees/get-unpaid?studentId=${studentId}`)
}

export const getChildrenFee = (isPaid: boolean) => {
    return api.get(`/fees/get-fee-for-children?isPaid=${isPaid}`)
}

export const initializePayment = (feeId: string) => {
    return api.post('/fees/initialize-payment', { feeId });
}