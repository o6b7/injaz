import ReusablePriorityPage from '../reusablePriorityPage';
import { Priority } from '@/state/api';

export default function LowPriorityPage() {
  return <ReusablePriorityPage priority={Priority.Low} />;
}
