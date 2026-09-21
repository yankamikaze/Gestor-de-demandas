'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Ticket } from '@/types';
import TicketCard from '@/components/TicketCard';
import { Search, Calendar as CalendarIcon, Filter, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function Concluidos() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateType, setDateType] = useState<'completed_at' | 'created_at'>('completed_at');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

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

  const uniqueAreas = Array.from(new Set(tickets.map(t => t.area))).sort();

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
        matchesDate = false;
      }
    }

    const matchesArea = selectedArea === '' || t.area === selectedArea;

    return matchesSearch && matchesDate && matchesArea;
  });

  const areaCounts = filtered.reduce((acc, ticket) => {
    acc[ticket.area] = (acc[ticket.area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(areaCounts).map(area => ({
    name: area,
    value: areaCounts[area]
  })).sort((a, b) => b.value - a.value);

  const inputClass = "px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-slate-500 dark:bg-[#111] dark:border-[#2a2a2a] dark:text-slate-200 transition-colors text-sm";

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Demandas Concluídas</h2>
        
        <div className="bg-white dark:bg-[#1a1a1a] dark:border-[#2a2a2a] border rounded-xl p-4 shadow-sm flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
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

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-500" />
              <select 
                value={selectedArea} 
                onChange={(e) => setSelectedArea(e.target.value)}
                className={inputClass}
              >
                <option value="">Todas as Áreas</option>
                {uniqueAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t dark:border-[#2a2a2a]">
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} className="text-slate-500" />
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
            
            {(startDate || endDate || selectedArea) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); setSelectedArea(''); }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline px-2"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Charts */}
        <div className="bg-white dark:bg-[#1a1a1a] dark:border-[#2a2a2a] border rounded-xl p-4 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold dark:text-slate-200">Demandas Concluídas por Área</h3>
              <p className="text-xs text-slate-500">Exibindo resultados conforme os filtros aplicados</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-[#111] p-1 rounded-lg border dark:border-[#2a2a2a]">
              <button 
                onClick={() => setChartType('bar')} 
                className={`p-1.5 rounded-md flex items-center gap-1 transition-colors ${chartType === 'bar' ? 'bg-white text-blue-600 shadow-sm dark:bg-[#222] dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                title="Gráfico de Barras"
              >
                <BarChart2 size={16} />
              </button>
              <button 
                onClick={() => setChartType('pie')}
                className={`p-1.5 rounded-md flex items-center gap-1 transition-colors ${chartType === 'pie' ? 'bg-white text-blue-600 shadow-sm dark:bg-[#222] dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                title="Gráfico de Pizza"
              >
                <PieChartIcon size={16} />
              </button>
            </div>
          </div>
          
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} stroke="#444" />
                    <YAxis tick={{ fontSize: 12, fill: '#888' }} stroke="#444" allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ fill: '#333', opacity: 0.2 }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                Nenhum dado para exibir com os filtros atuais.
              </div>
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
