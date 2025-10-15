import ReusablePriorityPage from '../reusablePriorityPage';
import { Priority } from '@/state/api';

export default function MediumPriorityPage() {
  return <ReusablePriorityPage priority={Priority.Medium} />;
}
