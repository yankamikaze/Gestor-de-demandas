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
    <div className={`p-4 rounded-xl border ${bg} min-h-[300px]`}>
      <h2 className="font-bold text-lg mb-1">{title}</h2>
      <p className="text-sm opacity-80 mb-4">{desc}</p>
      <div className="space-y-3">
        {getTicketsByQuadrant(num).map(t => (
          <TicketCard key={t.id} ticket={t} onUpdate={fetchTickets} onEdit={(t) => { setEditingTicket(t); setIsModalOpen(true); }} />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Matriz de Eisenhower</h2>
          <p className="text-slate-600">Gerencie suas demandas ativas</p>
        </div>
        <button onClick={openNewModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Nova Demanda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Quadrant num={1} title="1. Fazer Agora" desc="Urgente e Importante" bg="bg-red-50/50 border-red-200" />
        <Quadrant num={2} title="2. Planejar" desc="Importante, Não Urgente" bg="bg-blue-50/50 border-blue-200" />
        <Quadrant num={3} title="3. Delegar" desc="Urgente, Não Importante" bg="bg-yellow-50/50 border-yellow-200" />
        <Quadrant num={4} title="4. Eliminar" desc="Não Urgente, Não Importante" bg="bg-slate-50/50 border-slate-200" />
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
