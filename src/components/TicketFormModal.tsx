'use client';
import { useState, useEffect } from 'react';
import { Ticket } from '@/types';
import { supabase } from '@/lib/supabaseClient';

interface Props {
  ticket?: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function TicketFormModal({ ticket, isOpen, onClose, onSaved }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Incidente',
    area: '',
    quadrant: 1,
    description: '',
    status: 'Criado',
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        type: ticket.type,
        area: ticket.area,
        quadrant: ticket.quadrant,
        description: ticket.description,
        status: ticket.status,
      });
    } else {
      setFormData({
        title: '',
        type: 'Incidente',
        area: '',
        quadrant: 1,
        description: '',
        status: 'Criado',
      });
    }
  }, [ticket, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ticket) {
      await supabase.from('tickets').update(formData).eq('id', ticket.id);
    } else {
      await supabase.from('tickets').insert([{ ...formData }]);
    }
    onSaved();
    onClose();
  };

  const inputClass = "w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-slate-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 transition-colors";
  const labelClass = "block text-sm font-medium mb-1 dark:text-xs dark:text-slate-400 dark:mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 dark:backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg dark:border dark:border-slate-700 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-bold mb-4 dark:text-lg dark:font-semibold dark:mb-5 dark:tracking-tight dark:text-white">{ticket ? 'Editar Demanda' : 'Nova Demanda'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Título</label>
            <input required type="text" className={inputClass}
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tipo</label>
              <select className={inputClass}
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option>Incidente</option>
                <option>Melhoria</option>
                <option>Solicitação</option>
                <option>Projeto</option>
                <option>Manutenção</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Área Solicitante</label>
              <input required type="text" className={inputClass}
                value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Quadrante de Eisenhower</label>
            <select className={inputClass}
              value={formData.quadrant} onChange={e => setFormData({...formData, quadrant: Number(e.target.value)})}>
              <option value={1}>1. Urgente e Importante (Fazer Agora)</option>
              <option value={2}>2. Importante, Não Urgente (Planejar)</option>
              <option value={3}>3. Urgente, Não Importante (Delegar)</option>
              <option value={4}>4. Não Urgente, Não Importante (Eliminar)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Descrição</label>
            <textarea required rows={4} className={inputClass}
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="flex justify-end gap-2 dark:gap-3 pt-4 dark:pt-5 border-t dark:border-slate-700/50 mt-4 dark:mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-slate-50 dark:border-transparent dark:text-slate-400 dark:hover:bg-transparent dark:hover:text-slate-200 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 dark:bg-slate-100 dark:text-black dark:hover:bg-white transition-colors">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
