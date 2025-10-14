'use client'

import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { Team, useGetTeamsQuery } from '@/state/api';
import DataTable, { TableColumn, Direction } from 'react-data-table-component';
import React from 'react';
import { getCustomTableStyles } from '@/app/lib/utils';

const Teams = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: teams, error, isLoading } = useGetTeamsQuery();

  const columns: TableColumn<Team>[] = [
    {
      name: "مُعَرِّف الفريق",
      selector: (row) => row.id.toString(),
      sortable: true,
      cell: (row) => (
        <div className="font-medium text-sm dark:text-gray-100">
          {row.id}
        </div>
      ),
    },
    {
      name: "اسم الفريق",
      selector: (row) => row.teamName,
      sortable: true,
      cell: (row) => (
        <div className="font-medium text-sm dark:text-gray-100">
          {row.teamName}
        </div>
      ),
    },
    {
      name: "مُعَرِّف مالك المنتج",
      selector: (row) => row.productOwnerUserId?.toString() || "",
      cell: (row) => (
        <div className="text-sm font-medium dark:text-gray-300">
          {row.productOwnerUserId || (
            <span className="text-gray-400 text-xs">غير معين</span>
          )}
        </div>
      ),
    },
    {
      name: "مُعَرِّف مدير المشروع",
      selector: (row) => row.projectManagerUserId?.toString() || "",
      cell: (row) => (
        <div className="text-sm font-medium dark:text-gray-300">
          {row.projectManagerUserId || (
            <span className="text-gray-400 text-xs">غير معين</span>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg dark:text-gray-300">جاري التحميل...</div>
    </div>
  );

  if (error || !teams) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-red-600 dark:text-red-400">حدث خطأ أثناء جلب البيانات</div>
    </div>
  );

  return (
    <div className="h-full w-full p-4 pb-8 xl:px-6">
      <div className="pt-1">
        <div className="flex justify-between items-center mb-4">
          <Header name="الفِرق" isSmallText />
        </div>
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
          <DataTable
            columns={columns}
            data={teams}
            direction={Direction.RTL}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            highlightOnHover
            striped
            responsive
            noDataComponent={
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                لا توجد فرق لعرضها
              </div>
            }
            customStyles={getCustomTableStyles(isDarkMode)}
          />
        </div>
      </div>
    </div>
  );
};

export default Teams;