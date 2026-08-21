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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{ticket ? 'Editar Demanda' : 'Nova Demanda'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input required type="text" className="w-full border rounded p-2"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select className="w-full border rounded p-2"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option>Incidente</option>
                <option>Melhoria</option>
                <option>Solicitação</option>
                <option>Projeto</option>
                <option>Manutenção</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Área Solicitante</label>
              <input required type="text" className="w-full border rounded p-2"
                value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quadrante de Eisenhower</label>
            <select className="w-full border rounded p-2"
              value={formData.quadrant} onChange={e => setFormData({...formData, quadrant: Number(e.target.value)})}>
              <option value={1}>1. Urgente e Importante (Fazer Agora)</option>
              <option value={2}>2. Importante, Não Urgente (Planejar)</option>
              <option value={3}>3. Urgente, Não Importante (Delegar)</option>
              <option value={4}>4. Não Urgente, Não Importante (Eliminar)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea required rows={4} className="w-full border rounded p-2"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-slate-50">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
