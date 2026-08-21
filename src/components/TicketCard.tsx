'use client';
import { Ticket } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, Tag, User } from 'lucide-react';

interface Props {
  ticket: Ticket;
  onUpdate: () => void;
  onEdit: (ticket: Ticket) => void;
}

export default function TicketCard({ ticket, onUpdate, onEdit }: Props) {
  const handleStatusChange = async (newStatus: string) => {
    let completedAt = null;
    if (newStatus === 'Concluído') {
      completedAt = new Date().toISOString();
    }
    
    await supabase
      .from('tickets')
      .update({ status: newStatus, completed_at: completedAt })
      .eq('id', ticket.id);
      
    onUpdate();
  };

  const statusColors = {
    'Criado': 'bg-slate-200 text-slate-800',
    'Em desenvolvimento': 'bg-blue-100 text-blue-800',
    'Concluído': 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg line-clamp-2">{ticket.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[ticket.status]}`}>
          {ticket.status}
        </span>
      </div>
      
      <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">{ticket.description}</p>
      
      <div className="text-xs text-slate-500 space-y-1 mb-4">
        <div className="flex items-center gap-1"><Tag size={12}/> {ticket.type}</div>
        <div className="flex items-center gap-1"><User size={12}/> {ticket.area}</div>
        <div className="flex items-center gap-1"><Calendar size={12}/> {new Date(ticket.created_at).toLocaleDateString()}</div>
      </div>

      <div className="flex gap-2 mt-auto pt-4 border-t">
        <button 
          onClick={() => onEdit(ticket)}
          className="flex-1 text-sm bg-slate-100 hover:bg-slate-200 py-1.5 rounded"
        >
          Editar
        </button>
        
        {ticket.status === 'Criado' && (
          <button 
            onClick={() => handleStatusChange('Em desenvolvimento')}
            className="flex-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded"
          >
            Iniciar
          </button>
        )}
        
        {ticket.status === 'Em desenvolvimento' && (
          <button 
            onClick={() => handleStatusChange('Concluído')}
            className="flex-1 text-sm bg-green-50 hover:bg-green-100 text-green-700 py-1.5 rounded"
          >
            Concluir
          </button>
        )}
      </div>
    </div>
  );
}
