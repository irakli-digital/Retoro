import type { RetailerPolicy } from './types';

/**
 * Calculate the return deadline based on purchase date and retailer policy
 * @param purchaseDate - The date the item was purchased
 * @param policy - The retailer's return policy
 * @returns The calculated return deadline date
 */
export function calculateDeadline(
  purchaseDate: Date,
  policy: RetailerPolicy
): Date {
  const deadline = new Date(purchaseDate);
  
  // If return_window_days is 0, it means no deadline (like Nordstrom)
  if (policy.return_window_days === 0) {
    // Set to a far future date (e.g., 10 years from now)
    deadline.setFullYear(deadline.getFullYear() + 10);
    return deadline;
  }
  
  // Add the return window days
  deadline.setDate(deadline.getDate() + policy.return_window_days);
  
  return deadline;
}

/**
 * Calculate days remaining until return deadline
 * @param deadline - The return deadline date
 * @returns Number of days remaining (negative if past deadline)
 */
export function getDaysRemaining(deadline: Date): number {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get urgency color based on days remaining
 * @param daysRemaining - Number of days remaining
 * @returns Color class name for UI
 */
export function getUrgencyColor(daysRemaining: number): string {
  if (daysRemaining < 0) {
    return 'text-red-500'; // Past deadline
  }
  if (daysRemaining <= 2) {
    return 'text-red-500'; // Urgent - less than 2 days
  }
  if (daysRemaining <= 7) {
    return 'text-orange-500'; // Warning - less than 7 days
  }
  return 'text-green-500'; // Safe - more than 7 days
}

/**
 * Format days remaining as a human-readable string
 * @param daysRemaining - Number of days remaining
 * @returns Formatted string (e.g., "5 days left", "Overdue by 2 days")
 */
export function formatDaysRemaining(daysRemaining: number): string {
  if (daysRemaining < 0) {
    return `Overdue by ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'day' : 'days'}`;
  }
  if (daysRemaining === 0) {
    return 'Due today';
  }
  if (daysRemaining === 1) {
    return '1 day left';
  }
  return `${daysRemaining} days left`;
}

