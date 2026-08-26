import React, { useState } from 'react';
import { CourseItem, ViewType } from '../types';
import { initialCourses } from '../data/mockData';

interface CoursesViewProps {
  onNavigate: (view: ViewType) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  const categories = ['All', 'Frontend', 'Backend', 'DevOps & Cloud', 'AI & Machine Learning'];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleEnrollToggle = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const newStatus = !c.enrolled;
          return {
            ...c,
            enrolled: newStatus,
            progress: newStatus ? (c.progress > 0 ? c.progress : 5) : 0,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/30">
                INDUSTRY-ALIGNED CURRICULUM
              </span>
              <span className="text-xs text-slate-400 font-semibold">Tier-1 Engineering Syllabi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Engineering Courses & Labs
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Hands-on interactive masterclasses designed by principal engineers. Complete modules, verify assignments, and graduate with industry-recognized certificates.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <div className="text-center px-2">
              <span className="text-2xl font-black text-white">
                {courses.filter((c) => c.enrolled).length}
              </span>
              <span className="text-[11px] block text-slate-300 font-semibold">Enrolled</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="text-2xl font-black text-emerald-400">
                {courses.filter((c) => c.progress === 100).length}
              </span>
              <span className="text-[11px] block text-slate-300 font-semibold">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search courses, instructors, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#151f38] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#151f38] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-[#151f38] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Header */}
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs border border-white/10">
                    {course.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-blue-600/90 text-white backdrop-blur-xs">
                    {course.level}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-amber-400">star</span>
                    {course.rating} ({course.totalStudents.toLocaleString()} students)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {course.duration}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  Instructor: <strong className="text-slate-700 dark:text-slate-300">{course.instructor}</strong>
                </p>

                {/* Progress bar if enrolled */}
                {course.enrolled && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                      <span>Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {course.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 pt-0 flex items-center gap-3">
              <button
                onClick={() => setSelectedCourse(course)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Syllabus
              </button>

              <button
                onClick={() => handleEnrollToggle(course.id)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer text-center ${
                  course.enrolled
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {course.enrolled ? 'Resume Class' : 'Enroll Free'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#151f38] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                  {selectedCourse.category} • {selectedCourse.level}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>
                <strong>Instructor:</strong> {selectedCourse.instructor} • <strong>Duration:</strong> {selectedCourse.duration}
              </p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-2">Course Modules & Practical Projects:</h4>
              <ul className="space-y-2 list-disc list-inside bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {selectedCourse.modules.map((mod, i) => (
                  <li key={i} className="text-xs font-medium">
                    Module {i + 1}: {mod}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEnrollToggle(selectedCourse.id);
                  setSelectedCourse(null);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
              >
                {selectedCourse.enrolled ? 'Go To Active Lab' : 'Enroll In Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
