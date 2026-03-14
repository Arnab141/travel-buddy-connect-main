import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, XCircle, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";

function Allnotification() {
  const { notifications, unreadNotifications } = useUser();
  const navigate = useNavigate();

  const handleClick = (notification: any) => {
    if (notification.requestId) {
      navigate(`/trips/request/${notification.requestId}`, {
        state: { notificationId: notification.id },
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "join_request":
        return <UserPlus size={18} />;
      case "accepted":
        return <CheckCircle size={18} />;
      case "rejected":
        return <XCircle size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "join_request":
        return "bg-blue-100 text-blue-600";
      case "accepted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const renderNotification = (notification: any) => (
    <div
      key={notification.id}
      onClick={() => handleClick(notification)}
      className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        
        {/* Icon */}
        <div
          className={`p-3 rounded-xl ${getTypeColor(notification.type)}`}
        >
          {getIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="text-gray-800 font-semibold text-sm leading-relaxed">
              {notification.message}
            </p>

            {!notification.read && (
              <span className="ml-3 text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full">
                NEW
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

 return (
  <>
    <Navbar />

    {/* Main Wrapper */}
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header Card */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl rounded-3xl p-8 mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-gray-500 mt-2">
                Stay updated with your trip activity
              </p>
            </div>

            <div className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
              {unreadNotifications.length} Unread
            </div>
          </div>
        </div>

        {/* Unread Section */}
        {unreadNotifications.length > 0 && (
          <div className="mb-12">
            <h2 className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-6">
              Unread Notifications
            </h2>

            <div className="space-y-5">
              {unreadNotifications.map(renderNotification)}
            </div>
          </div>
        )}

        {/* All Notifications */}
        <div>
          <h2 className="text-gray-600 font-semibold text-sm uppercase tracking-wider mb-6">
            All Notifications
          </h2>

          {notifications.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-200">
              <Bell size={48} className="mx-auto text-gray-300 mb-5" />
              <p className="text-gray-600 text-lg font-medium">
                No notifications yet
              </p>
              <p className="text-gray-400 mt-2">
                Trip updates and responses will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {notifications.map(renderNotification)}
            </div>
          )}
        </div>

      </div>
    </div>
  </>
);
}

export default Allnotification;