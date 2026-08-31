'use client';
import { Ticket } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, Tag, User, CheckCircle } from 'lucide-react';

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

    const { error } = await supabase
      .from('tickets')
      .update({ status: newStatus, completed_at: completedAt })
      .eq('id', ticket.id);

    if (error) {
      alert('Erro ao atualizar status: ' + error.message);
      return;
    }
    onUpdate();
  };

  const statusColors = {
    'Criado': 'bg-slate-200 text-slate-800 dark:bg-[#2a2a2a] dark:text-slate-300 dark:border dark:border-[#3a3a3a]',
    'Em desenvolvimento': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 dark:border dark:border-blue-800/50',
    'Concluído': 'bg-green-100 text-green-800 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border dark:border-emerald-800/50',
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col h-full dark:bg-[#1a1a1a] dark:border-[#2a2a2a] dark:hover:border-[#3a3a3a] transition-colors">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="font-semibold text-lg line-clamp-2 dark:text-slate-200 dark:font-medium dark:text-sm">{ticket.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusColors[ticket.status]}`}>
          {ticket.status}
        </span>
      </div>

      <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow dark:text-xs dark:text-slate-400 dark:leading-relaxed">{ticket.description}</p>

      <div className="text-xs text-slate-500 space-y-1 mb-4">
        <div className="flex items-center gap-1"><Tag size={12}/> {ticket.type}</div>
        <div className="flex items-center gap-1"><User size={12}/> {ticket.area}</div>
        <div className="flex items-center gap-1" title="Data de Abertura"><Calendar size={12}/> Abertura: {new Date(ticket.created_at).toLocaleDateString()}</div>
        {ticket.completed_at && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500" title="Data de Conclusão">
            <CheckCircle size={12}/> Conclusão: {new Date(ticket.completed_at).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-auto pt-4 border-t dark:border-[#2a2a2a]">
        <button
          onClick={() => onEdit(ticket)}
          className="flex-1 text-sm bg-slate-100 hover:bg-slate-200 py-1.5 rounded dark:bg-[#2a2a2a] dark:hover:bg-[#333] dark:text-slate-300 transition-colors"
        >
          Editar
        </button>

        {ticket.status === 'Criado' && (
          <button
            onClick={() => handleStatusChange('Em desenvolvimento')}
            className="flex-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded dark:bg-blue-950/50 dark:hover:bg-blue-900/50 dark:text-blue-400 transition-colors"
          >
            Iniciar
          </button>
        )}

        {ticket.status === 'Em desenvolvimento' && (
          <button
            onClick={() => handleStatusChange('Concluído')}
            className="flex-1 text-sm bg-green-50 hover:bg-green-100 text-green-700 py-1.5 rounded dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 dark:text-emerald-400 transition-colors"
          >
            Concluir
          </button>
        )}
      </div>
    </div>
  );
}
