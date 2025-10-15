import ReusablePriorityPage from '../reusablePriorityPage';
import { Priority } from '@/state/api';

export default function HighPriorityPage() {
  return <ReusablePriorityPage priority={Priority.High} />;
}
