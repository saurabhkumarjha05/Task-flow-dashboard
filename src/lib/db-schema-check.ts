import { supabase } from '@/integrations/supabase/client';

export interface SchemaCheckResult {
  isValid: boolean;
  missingColumns: string[];
  existingColumns: string[];
  error?: string;
}

export async function checkTasksTableSchema(): Promise<SchemaCheckResult> {
  try {
    // Try to select a record to check the schema
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);

    if (error) {
      // If there's a schema error, it will likely mention missing columns
      const missingColumns: string[] = [];
      
      if (error.message.includes('due_date')) {
        missingColumns.push('due_date');
      }
      if (error.message.includes('priority')) {
        missingColumns.push('priority');
      }

      return {
        isValid: false,
        missingColumns,
        existingColumns: [],
        error: `Schema error: ${error.message}`
      };
    }

    // Expected columns for the tasks table
    const expectedColumns = [
      'id',
      'user_id', 
      'title',
      'description',
      'status',
      'priority',
      'due_date',
      'created_at',
      'updated_at'
    ];

    // If we have data, check its structure
    const existingColumns = data && data.length > 0 ? Object.keys(data[0]) : [];
    
    const missingColumns = expectedColumns.filter(
      column => !existingColumns.includes(column)
    );

    return {
      isValid: missingColumns.length === 0,
      missingColumns,
      existingColumns,
      error: missingColumns.length > 0 
        ? `Missing columns: ${missingColumns.join(', ')}`
        : undefined
    };
  } catch (error) {
    return {
      isValid: false,
      missingColumns: ['due_date', 'priority'],
      existingColumns: [],
      error: `Schema check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export function getSchemaErrorMessage(error: any): string {
  if (error?.message) {
    if (error.message.includes('column') && error.message.includes('does not exist')) {
      return 'Database schema error: Some columns may not exist. Please ensure database migrations have been applied.';
    }
    if (error.message.includes('permission denied')) {
      return 'Permission denied: Please check your database permissions.';
    }
    if (error.message.includes('connection')) {
      return 'Connection error: Please check your internet connection.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
