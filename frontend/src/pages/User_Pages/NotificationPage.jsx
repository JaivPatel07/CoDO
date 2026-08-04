import React, { useState, useEffect, useContext } from 'react';
import calculate_post_time from '../../reusable_methods/time_calculator';
import { retirve_notification } from '../../api/notification_apis';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contextAPI/userContext';
import { update_network_request } from '../../api/networks_api';
import { Bell, Users, MessageCircle, UserPlus, Check, X, ArrowRight, CheckCheck } from 'lucide-react';

// ── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  connection: {
    label: 'Connection',
    icon: UserPlus,
    color: 'from-violet-500 to-indigo-500',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  'connection request': {
    label: 'Connection',
    icon: UserPlus,
    color: 'from-violet-500 to-indigo-500',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  'team join': {
    label: 'Team',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  'team request': {
    label: 'Team',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  message: {
    label: 'Message',
    icon: MessageCircle,
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  event: {
    label: 'New Event',
    icon: Bell,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'connection', label: 'Connections' },
  { key: 'team join', label: 'Teams' },
  { key: 'message', label: 'Messages' },
  { key: 'event', label: 'Events' },
];

function NotificationSkeleton() {
  return (
    <div className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm animate-pulse">
      {/* Avatar with type badge */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-slate-100"></div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-200 border-2 border-white"></div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="h-4 bg-slate-100 rounded w-4/5 mb-2.5"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 bg-slate-100 rounded w-16"></div>
          <div className="h-3 bg-slate-100 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
const NotificationPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(UserContext);
  const [onconnection, handleConnection] = useState(true);

  useEffect(() => {
    const fetch_oldnotification = async () => {
      setLoading(true);
      try {
        const res = await retirve_notification();
        setNotifications(res.data);
      } catch (err) {
        console.log(err?.response);
      }
      finally {
        setLoading(false)
      }
    };
    setLoading(false);

    fetch_oldnotification();

    const safeUsername = userData.username?.replace(/@/g, '_at_').replace(/\+/g, '_plus_') || 'undefined';
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notification/user_${safeUsername}/`);
    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      const newNotification = { ...data, is_read: data.is_read !== undefined ? data.is_read : false };
      setNotifications(prev => [newNotification, ...prev]);
    };
    return () => { socket.close(); };
  }, [userData, onconnection]);

  const handleConnectionRequest = async (user_name, network_id) => {
    try {
      await update_network_request({ 'user_name': user_name, is_accept: true, network_id: network_id });
      // Remove only the handled notification from the list instead of re-fetching
      setNotifications(prev => prev.filter(n => n.event_id !== network_id));
    } catch (err) { console.log(err); }
  };
  const handleRejectRequest = async (user_name, network_id) => {
    try {
      await update_network_request({ 'user_name': user_name, is_accept: false, network_id: network_id });
      setNotifications(prev => prev.filter(n => n.event_id !== network_id));
    } catch (err) { console.log(err); }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    return notif.notification_type?.toLowerCase() === filter.toLowerCase();
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="selection:bg-violet-200 animate-in fade-in duration-500">

        {/* ── Header ── */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/25">
                  <Bell size={17} strokeWidth={2.5} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 text-[11px] font-black bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-slate-500 font-medium ml-12">Stay updated with your latest activity</p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 text-[12px] font-bold text-violet-600 hover:text-violet-700 transition-colors px-3 py-2 rounded-xl hover:bg-violet-50 active:scale-95"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>
            {/* Filter tabs */}
            <div className="flex gap-2 mt-6 overflow-x-auto pb-1 scrollbar-hide">
              {FILTER_TABS.map(tab => {
                const count = tab.key === 'all'
                  ? notifications.length
                  : notifications.filter(n => n.notification_type?.toLowerCase() === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap transition-all duration-200 ${filter === tab.key
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20 scale-[1.02]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-200 hover:text-violet-700 hover:bg-violet-50'
                      }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* ── Notification Cards ── */}
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <NotificationSkeleton key={i} />
                ))
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm px-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-violet-100">
                    <Bell size={32} className="text-violet-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">Your inbox is sparkling clean!</h3>
                  <p className="text-slate-500 text-[13px] mt-1.5 font-medium max-w-sm mx-auto">No notifications in this category. Why not explore some events or collaboration opportunities?</p>
                  <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
                    <button onClick={() => navigate(`/user/${userData.username}/events`)} className="rounded-2xl bg-violet-600 px-5 py-3 text-[13px] font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200">
                      Explore Events
                    </button>
                    <button onClick={() => navigate(`/user/${userData.username}/collabrate`)} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">
                      Find Collaborations
                    </button>
                  </div>
                </div>
              ) : ( 
                filteredNotifications.map((notif) => {
              const type = notif.notification_type?.toLowerCase();
              const isConnectionReq = type === 'connection' || type === 'connection request';
              const isTeamJoin = type === 'team join' || type === 'team request';
              const isEvent = type === 'event';
              const cfg = TYPE_CONFIG[type] || { icon: Bell, color: 'from-slate-400 to-slate-500', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
              const TypeIcon = cfg.icon;
              const senderProfileUrl = notif.sender_profile_url || `/user/${notif.senderusername}/profile`;
              const eventId = notif.event_id || notif.notification_post_id;

              return (
                <div
                  key={notif.id}
                  className={`group relative flex gap-4 p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${!notif.is_read
                    ? `${cfg.border} shadow-md`
                    : 'border-slate-200/80 shadow-sm'
                    }`}
                >
                  {/* Unread left accent bar */}
                  {!notif.is_read && (
                    <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gradient-to-b ${cfg.color}`} />
                  )}

                  {/* Avatar with type badge */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-slate-100">
                      {notif.user_pic_url ? (
                        <img src={notif.user_pic_url} alt={notif.senderusername} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${cfg.color}`}>
                          <span className="text-white font-black text-lg">
                            {notif.senderfullname?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Type badge */}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${cfg.color} flex items-center justify-center border-2 border-white shadow-sm`}>
                      <TypeIcon size={9} strokeWidth={2.5} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13.5px] text-slate-700 leading-snug font-medium">
                        <Link to={senderProfileUrl}>
                          <span className={`font-black hover:underline ${cfg.text}`}>{notif.senderfullname}</span>
                        </Link>
                        {' '}{notif.message}
                      </p>
                      {!notif.is_read && (
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 bg-gradient-to-br ${cfg.color}`} />
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.text} ${cfg.bg} px-2 py-0.5 rounded-full`}>
                        {cfg.label}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {calculate_post_time(notif.created_at)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {(isConnectionReq || isTeamJoin || isEvent) && (
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {isConnectionReq && (
                          <>
                            <button
                              onClick={() => handleConnectionRequest(notif.senderusername, notif.event_id)}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[12px] font-bold rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm shadow-violet-500/20 active:scale-95"
                            >
                              <Check size={12} strokeWidth={2.5} /> Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest(notif.senderusername, notif.event_id)}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[12px] font-bold rounded-lg hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                            >
                              <X size={12} strokeWidth={2.5} /> Decline
                            </button>
                          </>
                        )}
                        {isTeamJoin && (
                          <button
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-sm active:scale-95"
                            onClick={() => navigate(`/user/${userData.username}/managepost/${notif.event_id}`)}
                          >
                            View Request <ArrowRight size={12} strokeWidth={2.5} />
                          </button>
                        )}
                        {isEvent && (
                          <button
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all shadow-sm active:scale-95"
                            onClick={() => navigate(`/user/${userData.username}/event/${eventId}`)}
                          >
                            View Event <ArrowRight size={12} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
              )}
            </div>

          </div>
      </div>
    </div>
  );
};

export default NotificationPage;
