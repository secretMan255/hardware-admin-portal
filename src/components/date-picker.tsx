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
          <div className="flex items-centr gap-2">
               <Popover>
                    <PopoverTrigger asChild>
                         <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, 'dd-MM-yyyy') : 'Start date'}
                         </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                         <Calendar mode="single" selected={startDate ?? new Date()} onSelect={(date) => onStartDateChange(date ?? new Date())} initialFocus></Calendar>
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
                    <PopoverContent className="w-auto p-0" align="start">
                         <Calendar mode="single" selected={endDate ?? new Date()} onSelect={(date) => onEndDateChange(date ?? new Date())} initialFocus />
                    </PopoverContent>
               </Popover>
          </div>
     )
}
