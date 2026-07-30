import React, { useState, useEffect, useContext } from 'react';
import calculate_post_time from '../../reusable_methods/time_calculator';
import { retirve_notification } from '../../api/notification_apis';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contextAPI/userContext';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const { userData } = useContext(UserContext);

  // --- WebSockets ---
  useEffect(() => {
    const fetch_oldnotification = async () => {
      try {
        const res = await retirve_notification();
        console.log(res)
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
  }, [userData]);

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
    if (normalizedType === 'team request') return '👥';
    if (normalizedType === 'connection request') return '👤';
    return '🔔';
  };

  const getMessageText = (notif) => {
    if (notif.message) return notif.message;

    const type = notif.notification_type?.toLowerCase();
    if (type === 'team request') return 'sent you a team invitation.';
    if (type === 'connection request') return 'wants to connect with you.';

    return 'sent you a new notification.';
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100">
      <div className="max-w-3xl mx-auto pb-16">

        {/* Header section with Dropdown Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-5 pt-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inbox</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Stay updated with your latest activity.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Dropdown Filter */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none w-full bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold cursor-pointer transition-all"
              >
                <option value="all">All Notifications</option>
                <option value="connection request">Connection Requests</option>
                <option value="team request">Team Requests</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <button
              onClick={markAllAsRead}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap px-2 py-2 rounded-lg hover:bg-blue-50"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <span className="text-3xl">📭</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Inbox Zero</h3>
              <p className="text-slate-500 text-sm mt-1">You're all caught up on your notifications!</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isConnectionReq = notif.notification_type?.toLowerCase() === 'connection request';

              return (
                <div
                  key={notif.id}
                  className={`group relative flex gap-4 p-5 rounded-2xl bg-white transition-all duration-300 ${!notif.is_read
                      ? 'border border-blue-100 shadow-[0_2px_12px_-4px_rgba(59,130,246,0.12)]'
                      : 'border border-slate-200 shadow-sm opacity-90 hover:opacity-100'
                    }`}
                >
                  {/* Unread dot indicator */}
                  {!notif.is_read && (
                    <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"></div>
                  )}

                  {/* Avatar / Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {/* Show sender logo ONLY if it's a connection request AND url exists */}
                    {isConnectionReq && notif.user_pic_url ? (
                      <img
                        src={notif.user_pic_url}
                        alt={notif.senderusername}
                        className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-100 shadow-sm"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-lg border border-slate-100 shadow-sm">
                        {getAvatarFallback(notif.notification_type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {/* Updated dynamic URL and Full Name fields based on backend response */}
                      <Link to={`/user/${notif.senderusername}/profile`}>
                        <span className="font-bold text-blue-900 underline">{notif.senderfullname}</span>
                      </Link> {getMessageText(notif)}
                    </p>
                    <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
                      {calculate_post_time(notif.created_at)}
                    </p>

                    {/* Action Buttons Container */}
                    <div className="mt-3.5">
                      {isConnectionReq ? (
                        // Connection Request Actions (Accept & Decline)
                        <div className="flex flex-wrap items-center gap-2">
                          <button className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                            Accept
                          </button>
                          <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                            Decline
                          </button>
                        </div>
                      ) : (
                        // ALL Other Types Actions (Just View)
                        <button className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm group-hover:border-slate-300"
                          onClick={() => { navigate(`/user/${userData.username}/managepost/${notif.event_id}`) }}
                        >
                          View details
                          <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      )}
                    </div>
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