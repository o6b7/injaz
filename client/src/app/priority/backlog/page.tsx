import ReusablePriorityPage from '../reusablePriorityPage';
import { Priority } from '@/state/api';

export default function BacklogPriorityPage() {
  return <ReusablePriorityPage priority={Priority.Backlog} />;
}
