'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Ticket } from '@/types';
import TicketCard from '@/components/TicketCard';
import TicketFormModal from '@/components/TicketFormModal';

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const fetchTickets = async () => {
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .in('status', ['Criado', 'Em desenvolvimento'])
      .order('created_at', { ascending: false });
      
    if (data) setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openNewModal = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const getTicketsByQuadrant = (q: number) => tickets.filter(t => t.quadrant === q);

  const Quadrant = ({ title, desc, num, bgClass }: { title: string, desc: string, num: number, bgClass: string }) => (
    <div className={`p-4 rounded-xl border min-h-[300px] flex flex-col ${bgClass}`}>
      <div className="mb-4">
        <h2 className="font-bold text-lg dark:text-slate-100 dark:font-semibold">{title}</h2>
        <p className="text-sm opacity-80 dark:text-slate-400 dark:text-xs">{desc}</p>
      </div>
      <div className="space-y-3 flex-grow">
        {getTicketsByQuadrant(num).map(t => (
          <TicketCard key={t.id} ticket={t} onUpdate={fetchTickets} onEdit={(t) => { setEditingTicket(t); setIsModalOpen(true); }} />
        ))}
        {getTicketsByQuadrant(num).length === 0 && (
          <div className="text-sm text-slate-500 italic mt-4 text-center">Vazio</div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:tracking-tight">Matriz de Eisenhower</h2>
          <p className="text-slate-600 dark:text-slate-400 dark:text-sm mt-1">Gerencie suas demandas ativas</p>
        </div>
        <button onClick={openNewModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-slate-100 dark:text-black dark:hover:bg-white text-sm font-medium transition-colors">
          + Nova Demanda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Quadrant num={1} title="1. Fazer Agora" desc="Urgente e Importante" bgClass="bg-red-50/50 border-red-200 dark:bg-red-950/10 dark:border-red-900/30" />
        <Quadrant num={2} title="2. Planejar" desc="Importante, Não Urgente" bgClass="bg-blue-50/50 border-blue-200 dark:bg-blue-950/10 dark:border-blue-900/30" />
        <Quadrant num={3} title="3. Delegar" desc="Urgente, Não Importante" bgClass="bg-yellow-50/50 border-yellow-200 dark:bg-amber-950/10 dark:border-amber-900/30" />
        <Quadrant num={4} title="4. Eliminar" desc="Não Urgente, Não Importante" bgClass="bg-slate-50/50 border-slate-200 dark:bg-slate-800/20 dark:border-slate-800/50" />
      </div>

      <TicketFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSaved={fetchTickets}
        ticket={editingTicket}
      />
    </div>
  );
}
