import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, Column } from '@abdalkader/ui';
import { Badge } from '@abdalkader/ui';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# DataTable Component

Comprehensive data table with sorting, filtering, pagination, and row selection.

## Features

- **Sorting**: Click column headers to sort (ascending/descending)
- **Filtering**: Global search and per-column filters
- **Pagination**: Configurable page size with navigation
- **Selection**: Row selection with select all functionality
- **Responsive**: Mobile-friendly with horizontal scrolling
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable<User>>;

const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ['Admin', 'User', 'Guest'][i % 3],
  status: i % 3 === 0 ? 'active' : 'inactive',
  createdAt: new Date(2024, 0, i + 1).toLocaleDateString(),
}));

const columns: Column<User>[] = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    width: '80px',
  },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    filterable: true,
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    filterable: true,
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    filterable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value) => (
      <Badge variant={value === 'active' ? 'success' : 'secondary'}>
        {value}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    align: 'right',
  },
];

export const Default: Story = {
  args: {
    data: mockUsers,
    columns,
    pageSize: 10,
    showPagination: true,
    showSearch: true,
  },
};

export const WithSelection: Story = {
  args: {
    data: mockUsers,
    columns,
    pageSize: 10,
    showPagination: true,
    showSearch: true,
    showSelection: true,
    onSelectionChange: (selected) => {
      console.log('Selected:', selected);
    },
  },
};

export const WithRowClick: Story = {
  args: {
    data: mockUsers,
    columns,
    pageSize: 10,
    showPagination: true,
    showSearch: true,
    onRowClick: (row) => {
      alert(`Clicked: ${row.name}`);
    },
  },
};

export const StickyHeader: Story = {
  args: {
    data: mockUsers,
    columns,
    pageSize: 10,
    showPagination: true,
    showSearch: true,
    stickyHeader: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
    emptyMessage: 'No users found',
  },
};

