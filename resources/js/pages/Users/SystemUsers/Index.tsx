import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';

import { User, PaginatedUsers } from '@/types/user';
import { type BreadcrumbItem } from '@/types';

interface UsersIndexProps {
  auth: {
    user: User;
  };
  users: PaginatedUsers;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'System Users List',
        href: '/system-users/index',
    },
];


export default function Index({ auth, users }: UsersIndexProps) {
    return (
      <AppLayout
      breadcrumbs={breadcrumbs}
      >
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min">

              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">System Users List</h3>
                <Link
                  href={route('system-users.create')}
                  className="px-4 py-2 bg-[#e25b2a] text-white rounded hover:bg-[#0b0146]"
                >
                  Register System User
                </Link>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Password Update</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-gray-200">
                  {users.data.map((user: any) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user?.password_updated_at ?? 'Never Updated'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={route('system-users.edit', user.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          Edit
                        </Link>
                        <Link
                          method="delete"
                          as="button"
                          href={route('system-users.destroy', user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4">
                {users.links && users.links.map((link: any, index: number) => (
                  <Link
                    key={index}
                    href={link.url || ''}
                    className={`px-3 py-1 mx-1 rounded ${link.active ? 'bg-[#e25b2a] text-white' : 'bg-gray-200 text-gray-700'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          </div>
        
    </AppLayout>
  );
}
