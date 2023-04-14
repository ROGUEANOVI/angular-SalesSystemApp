import { SaleDetail } from "./sale-detail"

export interface Sale {
    saleId?: number,
    saleTicketNumber?: string,
    paymentType: string,
    total: string
    saleDetails: SaleDetail[]
    registrationDate?: string,
}
