import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as moment from 'moment'

export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
}

enum Status {
     Deactive = 0,
     Active = 1,
}

export function convertStatus(status: number): string {
     return Status[status] ?? 'Unknown'
}

export function convertUtcToLocal(utcDatetime: string) {
     return moment.utc(utcDatetime).local().format('YYYY-MM-DD')
}
