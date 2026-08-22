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

  const Quadrant = ({ title, desc, num, bg }: { title: string, desc: string, num: number, bg: string }) => (
    <div className={`p-4 rounded-xl border min-h-[300px] flex flex-col ${bg}`}>
      <div className="mb-4">
        <h2 className="font-semibold text-lg text-neutral-100">{title}</h2>
        <p className="text-xs text-neutral-400">{desc}</p>
      </div>
      <div className="space-y-3 flex-grow">
        {getTicketsByQuadrant(num).map(t => (
          <TicketCard key={t.id} ticket={t} onUpdate={fetchTickets} onEdit={(t) => { setEditingTicket(t); setIsModalOpen(true); }} />
        ))}
        {getTicketsByQuadrant(num).length === 0 && (
          <div className="text-sm text-neutral-600 italic mt-4 text-center">Vazio</div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Matriz de Eisenhower</h2>
          <p className="text-neutral-400 text-sm mt-1">Gerenciamento ativo de demandas</p>
        </div>
        <button onClick={openNewModal} className="bg-neutral-100 text-black px-4 py-2 rounded-lg hover:bg-white text-sm font-medium transition-colors">
          + Nova Demanda
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Quadrant num={1} title="1. Fazer Agora" desc="Urgente e Importante" bg="bg-red-950/10 border-red-900/30" />
        <Quadrant num={2} title="2. Planejar" desc="Importante, Não Urgente" bg="bg-indigo-950/10 border-indigo-900/30" />
        <Quadrant num={3} title="3. Delegar" desc="Urgente, Não Importante" bg="bg-amber-950/10 border-amber-900/30" />
        <Quadrant num={4} title="4. Eliminar" desc="Não Urgente, Não Importante" bg="bg-neutral-900/40 border-neutral-800/50" />
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
