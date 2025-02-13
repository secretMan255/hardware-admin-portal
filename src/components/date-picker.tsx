'use client'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

type DateRangePickerType = {
     startDate: Date | null
     endDate: Date | null
     onStartDateChange: (date: Date | null) => void
     onEndDateChange: (date: Date | null) => void
}

export const DateRangePicker: React.FC<DateRangePickerType> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
     return (
          <div className="flex items-center gap-2">
               <Popover>
                    <PopoverTrigger asChild>
                         <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, 'dd-MM-yyyy') : 'Start date'}
                         </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 bg-white shadow-lg border border-gray-300 rounded-md" align="start">
                         <Calendar mode="single" selected={startDate || undefined} onSelect={(date) => onStartDateChange(date ?? null)} initialFocus />
                    </PopoverContent>
               </Popover>
               <span className="pt-2">to</span>
               <Popover>
                    <PopoverTrigger asChild>
                         <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, 'dd-MM-yyyy') : 'End date'}
                         </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 bg-white shadow-lg border border-gray-300 rounded-md" align="start">
                         <Calendar mode="single" selected={endDate || undefined} onSelect={(date) => onEndDateChange(date ?? null)} initialFocus />
                    </PopoverContent>
               </Popover>
          </div>
     )
}
