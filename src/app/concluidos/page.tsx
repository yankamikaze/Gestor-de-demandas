'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Ticket } from '@/types';
import TicketCard from '@/components/TicketCard';
import { Search } from 'lucide-react';

export default function Concluidos() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTickets = async () => {
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .eq('status', 'Concluído')
      .order('completed_at', { ascending: false });
      
    if (data) setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = tickets.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Demandas Concluídas</h2>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar em título ou descrição..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <TicketCard key={t.id} ticket={t} onUpdate={fetchTickets} onEdit={() => {}} />
        ))}
        {filtered.length === 0 && (
          <p className="text-slate-500">Nenhum ticket concluído encontrado.</p>
        )}
      </div>
    </div>
  );
}
