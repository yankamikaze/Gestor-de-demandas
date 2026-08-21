export interface Ticket {
  id: string;
  title: string;
  type: string;
  area: string;
  quadrant: number;
  description: string;
  created_at: string;
  completed_at: string | null;
  status: 'Criado' | 'Em desenvolvimento' | 'Concluído';
}
