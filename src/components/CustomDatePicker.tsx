"use client";

import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDatePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  placeholder?: string;
  className?: string;
  popoverAlignment?: "left" | "right";
}

export default function CustomDatePicker({ id, value, onChange, min, placeholder = "Add date", className = "", popoverAlignment = "left" }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? startOfMonth(parseISO(value)) : startOfMonth(new Date()));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setCurrentMonth(startOfMonth(parseISO(value)));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateClick = (day: Date) => {
    if (min && isBefore(day, startOfDay(parseISO(min)))) return;
    onChange(format(day, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const today = startOfDay(new Date());
        const isPast = isBefore(day, today);
        const isBeforeMin = min ? isBefore(day, startOfDay(parseISO(min))) : false;
        const isDisabled = isPast || isBeforeMin;
        const isSelected = value ? isSameDay(day, parseISO(value)) : false;
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            onClick={() => !isDisabled && handleDateClick(cloneDay)}
            className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full text-xs md:text-sm font-semibold transition-all ${
              isDisabled ? "text-gray-300 cursor-not-allowed" :
              !isCurrentMonth ? "text-gray-300 cursor-pointer hover:bg-gray-100" :
              isSelected ? "bg-[#1C2024] text-white cursor-pointer" :
              "text-gray-700 hover:bg-gray-100 cursor-pointer"
            }`}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex justify-between w-full mb-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div 
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-transparent text-[12.5px] md:text-[14.5px] font-bold outline-none border-none p-0 cursor-pointer ${value ? 'text-gray-900' : 'text-gray-400'}`}
      >
        {value ? format(parseISO(value), "dd/MM/yyyy") : placeholder}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90] md:hidden" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
          <div 
            className={`
              fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              md:absolute md:top-[120%] md:transform-none
              ${popoverAlignment === 'right' ? 'md:right-[-10px] md:left-auto' : 'md:left-0 md:right-auto'}
              p-4 md:p-5 bg-white rounded-3xl shadow-2xl border border-gray-100 z-[100] w-[280px] md:w-[320px] animate-in fade-in zoom-in-95 md:slide-in-from-top-2
            `}
          >
            {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div className="font-bold text-sm md:text-base text-gray-900">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          
          {/* Days of week */}
          <div className="flex justify-between w-full mb-2">
            {daysOfWeek.map(d => (
              <div key={d} className="w-8 md:w-10 text-center text-xs font-bold text-gray-400">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="flex flex-col">
            {renderCells()}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
