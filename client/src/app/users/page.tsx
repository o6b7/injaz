'use client'

import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { useGetUsersQuery, User } from '@/state/api';
import DataTable, { TableColumn, Direction } from 'react-data-table-component';
import React from 'react';
import { getCustomTableStyles } from '@/app/lib/utils';
import Image from 'next/image';

const Users = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: users, error, isLoading } = useGetUsersQuery();

  const columns: TableColumn<User>[] = [
    {
      name: "صورة المستخدم",
      selector: (row) => row.profilePictureUrl || "",
      cell: (row) => (
        <div className="flex items-center justify-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {row.profilePictureUrl ? (
              <Image 
                src={`/${row.profilePictureUrl}`}
                alt={row.username}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-full">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {row.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "مُعَرِّف المستخدم",
      selector: (row) => row.userId?.toString() || "",
      sortable: true,
      cell: (row) => (
        <div className="font-medium text-sm dark:text-gray-100">
          {row.userId || "-"}
        </div>
      ),
    },
    {
      name: "اسم المستخدم",
      selector: (row) => row.username,
      sortable: true,
      cell: (row) => (
        <div className="font-medium text-sm dark:text-gray-100">
          {row.username}
        </div>
      ),
    },
    {
      name: "البريد الإلكتروني",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <div className="text-xs text-gray-600 dark:text-gray-300 truncate" title={row.email}>
          {row.email || "-"}
        </div>
      ),
    },
    {
      name: "معرف الفريق",
      selector: (row) => row.teamId?.toString() || "",
      cell: (row) => (
        <div className="text-xs font-medium dark:text-gray-300">
          {row.teamId || "-"}
        </div>
      ),
    },
  ];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg dark:text-gray-300">جاري التحميل...</div>
    </div>
  );

  if (error || !users) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-red-600 dark:text-red-400">حدث خطأ أثناء جلب البيانات</div>
    </div>
  );

  return (
    <div className="h-full w-full p-4 pb-8 xl:px-6">
      <div className="pt-1">
        <div className="flex justify-between items-center mb-4">
          <Header name="المستخدمين" isSmallText />
        </div>
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
          <DataTable
            columns={columns}
            data={users}
            direction={Direction.RTL}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            highlightOnHover
            striped
            responsive
            noDataComponent={
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                لا توجد مستخدمين لعرضها
              </div>
            }
            customStyles={getCustomTableStyles(isDarkMode)}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;