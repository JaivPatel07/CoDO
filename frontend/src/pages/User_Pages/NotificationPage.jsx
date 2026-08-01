import React, { useState, useEffect, useContext } from 'react';
import calculate_post_time from '../../reusable_methods/time_calculator';
import { retirve_notification } from '../../api/notification_apis';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contextAPI/userContext';
import { update_network_request } from '../../api/networks_api';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const { userData } = useContext(UserContext);
  const [onconnection, handleConnection] = useState(true);

  // --- WebSockets ---
  useEffect(() => {
    const fetch_oldnotification = async () => {
      try {
        const res = await retirve_notification();
        // console.log(res)
        setNotifications(res.data);
      } catch (err) {
        if (err.response?.status) {
          console.log("Server Error");
        } else {
          console.log(err?.response);
        }
      }
    };

    fetch_oldnotification();

    // ===> to add new and live notifications without refresh 
    // ===> dynamically pass the user name
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notification/user_${userData.username}/`);

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      // Fixed the is_read logic to accurately capture backend's boolean or default to false
      const newNotification = { ...data, is_read: data.is_read !== undefined ? data.is_read : false };

      // Use functional state update to prevent WebSocket reconnection loop
      setNotifications(prev => [newNotification, ...prev]);
    };

    // Cleanup function to close the socket when the component unmounts
    return () => {
      socket.close();
    };
  }, [userData, onconnection]);

  const handleConnectionRequest = async (user_name, network_id) => {
    try {
      await update_network_request({ 'user_name': user_name, is_accept: true, network_id: network_id });
      handleConnection(!onconnection);
    } catch (err) {
      console.log(err);
    }
  }
  const handleRejectRequest = async (user_name, network_id) => {
    try {
      await update_network_request({ 'user_name': user_name, is_accept: false, network_id: network_id });
      handleConnection(!onconnection);
    } catch (err) {
      console.log(err);
    }
  }

  // --- Filtering Logic ---
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    // Normalize string casing to match backend data safely
    return notif.notification_type?.toLowerCase() === filter.toLowerCase();
  });

  const markAllAsRead = () => {
    // Note: To make this persistent, you'll need an API call here later
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  // --- Helpers ---
  const getAvatarFallback = (type) => {
    const normalizedType = type?.toLowerCase();
    if (normalizedType === 'team join' || normalizedType === 'team request') return '👥';
    if (normalizedType === 'connection' || normalizedType === 'connection request') return '👤';
    if (normalizedType === 'message') return '💬';
    return '🔔';
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 font-sans selection:bg-violet-200">
      <div className="max-w-3xl mx-auto pb-16 pt-10">

        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-5">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Stay updated with your latest activity.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none group">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none w-full bg-white border border-slate-200/80 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-[13px] font-bold cursor-pointer transition-all hover:bg-slate-50"
              >
                <option value="all">All Notifications</option>
                <option value="connection">Connection Requests</option>
                <option value="team join">Team Requests</option>
                <option value="message">Messages</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-hover:text-violet-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <button
              onClick={markAllAsRead}
              className="text-[13px] font-bold text-violet-600 hover:text-violet-700 transition-colors whitespace-nowrap px-3 py-2.5 rounded-xl hover:bg-violet-50"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <span className="text-3xl">📭</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">Inbox Zero</h3>
              <p className="text-slate-500 text-sm mt-1 font-medium">You're all caught up on your notifications!</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const type = notif.notification_type?.toLowerCase();
              const isConnectionReq = type === 'connection' || type === 'connection request';
              const isTeamJoin = type === 'team join' || type === 'team request';
              const isMessage = type === 'message';

              return (
                <div
                  key={notif.id}
                  className={`group relative flex gap-4 p-5 rounded-2xl bg-white transition-all duration-300 ${!notif.is_read
                    ? 'border border-violet-200 shadow-md shadow-violet-500/5'
                    : 'border border-slate-200/80 shadow-sm hover:shadow-md'
                    }`}
                >
                  {/* Unread dot indicator */}
                  {!notif.is_read && (
                    <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-violet-600 shadow-[0_0_0_4px_rgba(124,58,237,0.1)]"></div>
                  )}

                  {/* Avatar / Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {notif.user_pic_url ? (
                      <img
                        src={notif.user_pic_url}
                        alt={notif.senderusername}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-50 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl border border-slate-100 shadow-sm">
                        {getAvatarFallback(type)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                      <Link to={`/user/${notif.senderusername}/profile`}>
                        <span className="font-bold text-violet-700 hover:text-violet-800 transition-colors mr-1">{notif.senderfullname}</span>
                      </Link>
                      {notif.message}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
                      {calculate_post_time(notif.created_at)}
                    </p>

                    {!isMessage && (
                      <div className="mt-3.5">
                        {isConnectionReq && (
                          <div className="flex flex-wrap items-center gap-2">
                            <button onClick={() => handleConnectionRequest(notif.senderusername, notif.event_id)} className="px-4 py-1.5 bg-violet-600 text-white text-[12px] font-bold rounded-lg hover:bg-violet-700 transition-colors shadow-sm shadow-violet-500/20 active:scale-95">
                              Accept
                            </button>
                            <button onClick={() => handleRejectRequest(notif.senderusername, notif.event_id)} className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[12px] font-bold rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm active:scale-95">
                              Reject
                            </button>
                          </div>
                        )}

                        {isTeamJoin && (
                          <button className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-colors shadow-sm group-hover:border-slate-300 active:scale-95"
                            onClick={() => { navigate(`/user/${userData.username}/managepost/${notif.event_id}`) }}
                          >
                            View details
                            <svg className="w-3.5 h-3.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                            </svg>
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
  );
};

export default NotificationPage;