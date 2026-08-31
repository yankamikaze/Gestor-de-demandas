'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Ticket } from '@/types';
import TicketCard from '@/components/TicketCard';
import { Search, Calendar as CalendarIcon, Filter } from 'lucide-react';

export default function Concluidos() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateType, setDateType] = useState<'completed_at' | 'created_at'>('completed_at');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('status', 'Concluído')
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar concluídos:', error.message);
      return;
    }
    if (data) setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (startDate || endDate) {
      const ticketDateStr = t[dateType];
      if (ticketDateStr) {
        const ticketDate = new Date(ticketDateStr);
        
        if (startDate) {
          const start = new Date(startDate + 'T00:00:00');
          if (ticketDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate + 'T23:59:59');
          if (ticketDate > end) matchesDate = false;
        }
      } else {
        // Se a data não existir (ex: não tem completed_at por algum motivo), filtra fora.
        matchesDate = false;
      }
    }

    return matchesSearch && matchesDate;
  });

  const inputClass = "px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-slate-500 dark:bg-[#111] dark:border-[#2a2a2a] dark:text-slate-200 transition-colors text-sm";

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Demandas Concluídas</h2>
        
        <div className="bg-white dark:bg-[#1a1a1a] dark:border-[#2a2a2a] border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Buscar em título ou descrição..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-slate-500 dark:bg-[#111] dark:border-[#2a2a2a] dark:text-slate-200 dark:placeholder:text-slate-500 transition-colors text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-500" />
              <select 
                value={dateType} 
                onChange={(e) => setDateType(e.target.value as 'completed_at' | 'created_at')}
                className={inputClass}
              >
                <option value="completed_at">Data de Conclusão</option>
                <option value="created_at">Data de Abertura</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">De:</span>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Até:</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
            
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline px-2"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <TicketCard key={t.id} ticket={t} onUpdate={fetchTickets} onEdit={() => {}} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed rounded-lg dark:border-[#2a2a2a]">
            <p className="text-slate-500">Nenhum ticket concluído encontrado com esses filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
