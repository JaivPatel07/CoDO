import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Star, GitFork, Eye, 
  MessageCircle, GitPullRequest, Code2,
  Users, ExternalLink, Calendar, CheckCircle2,
  BookOpen
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { fetchOpenSourceProjectDetails } from '../../api/opensource_apis';

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────────────────────────────────────
function OpenSourceProjectDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 dark:text-slate-100 font-sans pb-20 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-4 w-32 bg-slate-200 rounded-md mb-6 dark:bg-slate-700" />
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-64 bg-slate-200 rounded-lg dark:bg-slate-700" />
                <div className="h-6 w-24 bg-indigo-100 rounded-full dark:bg-indigo-500/30" />
              </div>
              <div className="h-6 w-96 bg-slate-200 rounded-md mb-4 dark:bg-slate-700" />
              
              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400 mt-2">
                <div className="h-7 w-32 bg-slate-100 rounded-full" />
                <div className="h-5 w-20 bg-slate-100 rounded-md" />
                <div className="h-5 w-20 bg-slate-100 rounded-md" />
                <div className="h-5 w-24 bg-slate-100 rounded-md" />
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="h-12 w-full bg-slate-200 rounded-xl dark:bg-slate-700" />
              <div className="h-12 w-full bg-slate-100 rounded-xl dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
              <div className="h-6 w-48 bg-slate-200 rounded-md" />
              <div className="h-4 w-full bg-slate-100 rounded-md" />
              <div className="h-4 w-full bg-slate-100 rounded-md" />
              <div className="h-4 w-3/4 bg-slate-100 rounded-md" />
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
              <div className="h-6 w-40 bg-slate-200 rounded-md" />
              <div className="grid grid-cols-2 gap-6">
                <div className="h-48 bg-slate-100 rounded-2xl dark:bg-slate-800" />
                <div className="h-48 bg-slate-100 rounded-2xl dark:bg-slate-800" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
              <div className="h-6 w-32 bg-slate-200 rounded-md" />
              <div className="flex flex-wrap gap-3"><div className="h-8 w-24 bg-slate-100 rounded-xl" /><div className="h-8 w-20 bg-slate-100 rounded-xl" /></div>
            </div>
          </div>
          {/* Sidebar Skeleton */}
          <div className="space-y-6"><div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] h-48" /><div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] h-40" /><div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] h-48" /></div>
        </div>
      </main>
    </div>
  );
}

export default function OpenSourceProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await fetchOpenSourceProjectDetails(id);
        setProject(res.data);
      } catch (err) {
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  if (loading) {
    return <OpenSourceProjectDetailsSkeleton />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 flex flex-col items-center shadow-sm animate-in fade-in duration-500 max-w-md text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">{error || 'Project not found'}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">The open-source project you are looking for could not be found or an error occurred.</p>
          <Link to=".." className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
            <ArrowLeft className="w-4 h-4" /> Go back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 dark:text-slate-100 font-sans pb-20">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to=".." className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div> 
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{project.repository_name}</h1>
                <span className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full border border-violet-200 shrink-0">
                  {project.status || 'Active'}
                </span>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">{project.tagline}</p>
              
              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400 mt-2"> 
                <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 bg-slate-100 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                  {project.owner_username}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 shrink-0" /> {project.stars} Stars
                </div>
                <div className="flex items-center gap-1.5">
                  <GitFork className="w-4 h-4 shrink-0" /> {project.forks} Forks
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 shrink-0" /> {project.open_issues} Issues
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]"> 
              <a 
                href={project.repository_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                <FaGithub className="w-5 h-5" />
                View Repository
              </a>
              {project.demo_url && (
                <a 
                  href={project.demo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */} 
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-violet-500" />
                About the Project
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 dark:text-slate-400 leading-relaxed"> {/* Removed mb-4 from paragraphs */}
                {project.description.split('\n').map((paragraph, idx) => ( // Removed mb-4
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {project.screenshots && project.screenshots.length > 0 && ( 
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-violet-500" />
                  Screenshots
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.screenshots.map((url, idx) => (
                    <img key={idx} src={url} alt={`Screenshot ${idx+1}`} className="w-full h-48 object-cover rounded-2xl border border-slate-200 dark:border-slate-700" />
                  ))}
                </div>
              </section>
            )}

            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <Code2 className="w-5 h-5 text-violet-500" />
                Tech Stack
              </h2>
              {project.technologies && project.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-violet-50/50 border border-violet-100 text-violet-700 text-sm font-semibold rounded-xl transition-colors hover:bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-300">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400 dark:text-slate-500 italic">
                  Not specified
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6"> 
            <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-3">
                <Users className="w-5 h-5 text-emerald-500" />
                Roles Needed
              </h3>
              {project.roles_needed && project.roles_needed.length > 0 ? (
                <div className="space-y-3">
                  {project.roles_needed.map(role => (
                    <div key={role} className="flex items-center gap-3 p-3 bg-emerald-50/50 text-emerald-800 rounded-xl border border-emerald-100 transition-colors hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-sm font-semibold">{role}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400 dark:text-slate-500 italic">Not specified</div>
              )}
            </section>

            <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-500" />
                Skills Required
              </h3>
              {project.skills_required && project.skills_required.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.skills_required.map(skill => (
                    <span key={skill} className="px-4 py-1.5 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200/50 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400 dark:text-slate-500 italic">Not specified</div>
              )}
            </section>

            <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                Project Details
              </h3>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-slate-500 dark:text-slate-400">Category</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 px-3 py-1 rounded-lg">{project.category || 'N/A'}</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-slate-500 dark:text-slate-400">Difficulty</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 px-3 py-1 rounded-lg">{project.difficulty}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Updated At</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{new Date(project.updated_at).toLocaleDateString()}</span>
                </li>
              </ul>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
