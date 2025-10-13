"use client";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { SearchIcon, X, Loader2, SlidersHorizontal } from "lucide-react";

type Category = "all" | "tasks" | "projects" | "users";

const Search = () => {
  const [term, setTerm] = useState(""), [cat, setCat] = useState<Category>("all"), [showFilters, setShowFilters] = useState(false);
  const { data, isLoading, isError, isFetching } = useSearchQuery(term, { skip: term.length < 2 });
  const handleSearch = useCallback(debounce((v: string) => setTerm(v), 500), []);

  useEffect(() => () => handleSearch.cancel(), [handleSearch]);

  const clear = () => { setTerm(""); handleSearch.cancel(); };
  const filtered = {
    tasks: cat === "all" || cat === "tasks" ? data?.tasks || [] : [],
    projects: cat === "all" || cat === "projects" ? data?.projects || [] : [],
    users: cat === "all" || cat === "users" ? data?.users || [] : [],
  };
  const counts = {
    tasks: data?.tasks?.length || 0,
    projects: data?.projects?.length || 0,
    users: data?.users?.length || 0,
    total: (data?.tasks?.length || 0) + (data?.projects?.length || 0) + (data?.users?.length || 0),
  };

  const hasResults = counts.total > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-main p-4 md:p-8">
      <Header name="البحث" />
      <div className="max-w-6xl mx-auto">
        {/* Input */}
        <div className="relative mb-6">
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            placeholder="ابحث في المهام، المشاريع، المستخدمين..."
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 p-4 pr-12 bg-white dark:bg-dark-secondary text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {term && (
            <button onClick={clear} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search status */}
        {term.length >= 2 && (
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              {(isLoading || isFetching) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> <span>جاري البحث...</span>
                </>
              ) : hasResults ? (
                <span>تم العثور على {counts.total} نتيجة</span>
              ) : (
                <span>لا توجد نتائج</span>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <SlidersHorizontal className="w-4 h-4" /> التصفية
            </button>
          </div>
        )}

        {/* Category filters */}
        {term.length >= 2 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              ["all", "الكل", counts.total, "blue"],
              ["tasks", "المهام", counts.tasks, "emerald"],
              ["projects", "المشاريع", counts.projects, "amber"],
              ["users", "المستخدمين", counts.users, "purple"],
            ].map(([key, label, count, color]) => (
              <button
                key={key}
                onClick={() => setCat(key as Category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium border transition-all ${
                  cat === key
                    ? `bg-${color}-500 text-white shadow-md shadow-${color}-500/30`
                    : "bg-white dark:bg-dark-secondary border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {label}
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* States */}
        {(isLoading || isFetching) && (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">جاري البحث...</p>
          </div>
        )}
        {isError && (
          <p className="text-center text-red-500 py-8">حدث خطأ أثناء البحث. حاول لاحقاً.</p>
        )}
        {!isLoading && !isError && term.length >= 2 && !hasResults && (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">لم يتم العثور على نتائج لـ "{term}"</p>
          </div>
        )}

        {/* Initial State */}
        {!term && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <SearchIcon className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">ابدأ بالبحث</h3>
            <p>ابحث في المهام، المشاريع، أو المستخدمين.</p>
          </div>
        )}

        {/* Results */}
        {hasResults && (
          <div className="space-y-10">
            {filtered.tasks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                  المهام ({counts.tasks})
                </h2>
                <div className="space-y-4">{filtered.tasks.map((t) => <TaskCard key={t.id} task={t} showStatusToggle />)}</div>
              </section>
            )}
            {filtered.projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                  المشاريع ({counts.projects})
                </h2>
                <div className="space-y-4">{filtered.projects.map((p) => <ProjectCard key={p.id} project={p} />)}</div>
              </section>
            )}
            {filtered.users.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">
                  المستخدمين ({counts.users})
                </h2>
                <div className="space-y-4">{filtered.users.map((u) => <UserCard key={u.userId} user={u} />)}</div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
