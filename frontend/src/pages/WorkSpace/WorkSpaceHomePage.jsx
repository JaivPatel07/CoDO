import React, { useContext, useEffect, useState } from 'react';
import { Plus, Trash2, UserPlus, Users, ExternalLink, Shield, X } from 'lucide-react';
import { replace, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contextAPI/userContext';
import { fetch_workspace_team, get_repo_commits, get_repo_pulls, connect_workspace_repo } from '../../api/workspace_apis';

export const WorkSpaceHomePage = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  // Teams State
  const [teams, setTeams] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'lead', 'member'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    const fetch_teams = async () => {
      try {
        const response = await fetch_workspace_team();
        console.log(response.data);
        setTeams(response.data);
      } catch (err) {
        console.log(err?.response);
      }
    };
    fetch_teams();
  }, []);

  // Filter logic
  const filteredTeams = teams.filter((team) => {
    if (activeFilter === 'all') return true;
    return team.role === activeFilter;
  });

  const handleDelete = (id) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  const handleWrokSpace = (team_id) => {
    navigate(`/user/${userData.username}/workspace/team/${team_id}`, { state: { receiver: teams[0].workspace_id }, replace: true });
  };

  const handleCreateTeam = () => {
    // Here you would typically make an API call to save the new team
    const newTeam = {
      id: Date.now(), // dummy ID
      title: newTeamName,
      membersCount: 1,
      role: 'lead',
      workspace_id: 'new_workspace_id'
    };
    
    setTeams([newTeam, ...teams]);
    
    // Reset and close modal
    setNewTeamName('');
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTeamName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto p-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Teams</h1>
            <p className="text-slate-500 mt-1">Manage your workspaces and team collaborations.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            Create New Team
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-xl border border-slate-200 inline-flex shadow-sm">
          {['all', 'lead', 'member'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setActiveFilter(filterType)}
              className={`capitalize px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filterType
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>

        {/* Teams List */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-12 px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
            <div className="col-span-5">Team</div>
            <div className="col-span-2 text-center">Members</div>
            <div className="col-span-2 text-center">Role</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* Rows */}
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="grid grid-cols-12 items-center px-6 py-5 border-b border-slate-100 hover:bg-slate-50 transition"
            >
              {/* Team Name */}
              <div className="col-span-5">
                <h3 className="font-semibold text-slate-900">{team.title}</h3>
              </div>

              {/* Members */}
              <div className="col-span-2 flex justify-center">
                <span className="flex items-center gap-2 text-slate-600">
                  <Users size={16} />
                  {team.membersCount}
                </span>
              </div>

              {/* Role Badge */}
              <div className="col-span-2 flex justify-center">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    team.role === "lead"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {team.role === "lead" ? (
                    <>
                      <Shield size={14} />
                      Leader
                    </>
                  ) : (
                    <>
                      <Users size={14} />
                      Member
                    </>
                  )}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-3 flex justify-end items-center gap-2">
                {team.role === "lead" && (
                  <>
                    <button
                      className="p-2 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition"
                      title="Add Member"
                    >
                      <UserPlus size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(team.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
                      title="Delete Team"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleWrokSpace(team.id)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Workspace
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Empty */}
          {filteredTeams.length === 0 && (
            <div className="py-16 text-center">
              <Users size={50} className="mx-auto text-slate-300 mb-3" />
              <h3 className="font-semibold text-slate-900">No Teams Found</h3>
              <p className="text-slate-500 mt-1">
                You don't have any teams matching this filter.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Create Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Create New Team</h2>
              <button 
                onClick={closeModal}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Frontend Developers"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!newTeamName.trim()}
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition shadow-sm"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};