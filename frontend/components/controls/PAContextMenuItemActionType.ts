/**
 * Action type for context menu items
 */
export enum PAContextMenuItemActionType {
  /**
   * Default action with normal styling
   */
  default = 'default',
  /**
   * Destructive action (e.g., delete) with prominent warning styling
   */
  destructive = 'destructive',
  /**
   * Separator line for visual grouping
   */
  separator = 'separator',
}
