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
    'Criado': 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 dark:border dark:border-slate-600',
    'Em desenvolvimento': 'bg-blue-100 text-blue-800 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border dark:border-indigo-800',
    'Concluído': 'bg-green-100 text-green-800 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border dark:border-emerald-800',
  };

  return (
    <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-4 shadow-sm flex flex-col h-full hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-2 dark:mb-3 gap-2">
        <h3 className="font-semibold text-lg line-clamp-2 dark:text-slate-200 dark:font-medium dark:text-sm">{ticket.title}</h3>
        <span className={`text-xs px-2 py-1 dark:text-[10px] dark:py-0.5 rounded-full font-medium whitespace-nowrap ${statusColors[ticket.status]}`}>
          {ticket.status}
        </span>
      </div>
      
      <p className="text-sm text-slate-600 dark:text-xs dark:text-slate-400 mb-4 line-clamp-3 flex-grow dark:leading-relaxed">{ticket.description}</p>
      
      <div className="text-xs text-slate-500 dark:text-[11px] dark:text-slate-500 space-y-1 dark:space-y-1.5 mb-4 dark:font-medium">
        <div className="flex items-center gap-1 dark:gap-1.5"><Tag size={12} className="dark:text-slate-500"/> {ticket.type}</div>
        <div className="flex items-center gap-1 dark:gap-1.5"><User size={12} className="dark:text-slate-500"/> {ticket.area}</div>
        <div className="flex items-center gap-1 dark:gap-1.5"><Calendar size={12} className="dark:text-slate-500"/> {new Date(ticket.created_at).toLocaleDateString()}</div>
      </div>

      <div className="flex gap-2 mt-auto pt-4 dark:pt-3 border-t dark:border-slate-700/50">
        <button 
          onClick={() => onEdit(ticket)}
          className="flex-1 text-sm dark:text-[11px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 py-1.5 rounded transition-colors"
        >
          Editar
        </button>
        
        {ticket.status === 'Criado' && (
          <button 
            onClick={() => handleStatusChange('Em desenvolvimento')}
            className="flex-1 text-sm dark:text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-400 py-1.5 rounded transition-colors"
          >
            Iniciar
          </button>
        )}
        
        {ticket.status === 'Em desenvolvimento' && (
          <button 
            onClick={() => handleStatusChange('Concluído')}
            className="flex-1 text-sm dark:text-[11px] bg-green-50 hover:bg-green-100 text-green-700 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 dark:text-emerald-400 py-1.5 rounded transition-colors"
          >
            Concluir
          </button>
        )}
      </div>
    </div>
  );
}
