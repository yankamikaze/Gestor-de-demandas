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
    'Criado': 'bg-neutral-800 text-neutral-300 border border-neutral-700',
    'Em desenvolvimento': 'bg-indigo-900/30 text-indigo-300 border border-indigo-900/50',
    'Concluído': 'bg-emerald-900/20 text-emerald-400 border border-emerald-900/30',
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 shadow-sm flex flex-col h-full hover:border-neutral-700 transition-colors">
      <div className="flex justify-between items-start mb-3 gap-2">
        <h3 className="font-medium text-neutral-200 line-clamp-2 text-sm">{ticket.title}</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColors[ticket.status]}`}>
          {ticket.status}
        </span>
      </div>
      
      <p className="text-xs text-neutral-400 mb-4 line-clamp-3 flex-grow leading-relaxed">{ticket.description}</p>
      
      <div className="text-[11px] text-neutral-500 space-y-1.5 mb-4 font-medium">
        <div className="flex items-center gap-1.5"><Tag size={12} className="text-neutral-600"/> {ticket.type}</div>
        <div className="flex items-center gap-1.5"><User size={12} className="text-neutral-600"/> {ticket.area}</div>
        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-neutral-600"/> {new Date(ticket.created_at).toLocaleDateString()}</div>
      </div>

      <div className="flex gap-2 mt-auto pt-3 border-t border-neutral-800/50">
        <button 
          onClick={() => onEdit(ticket)}
          className="flex-1 text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 py-1.5 rounded transition-colors"
        >
          Editar
        </button>
        
        {ticket.status === 'Criado' && (
          <button 
            onClick={() => handleStatusChange('Em desenvolvimento')}
            className="flex-1 text-[11px] font-medium bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-400 py-1.5 rounded transition-colors"
          >
            Iniciar
          </button>
        )}
        
        {ticket.status === 'Em desenvolvimento' && (
          <button 
            onClick={() => handleStatusChange('Concluído')}
            className="flex-1 text-[11px] font-medium bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 py-1.5 rounded transition-colors"
          >
            Concluir
          </button>
        )}
      </div>
    </div>
  );
}
