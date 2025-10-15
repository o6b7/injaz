import ReusablePriorityPage from '../reusablePriorityPage';
import { Priority } from '@/state/api';

export default function UrgentPriorityPage() {
  return <ReusablePriorityPage priority={Priority.Urgent} />;
}
