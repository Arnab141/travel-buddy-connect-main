import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Mail, Phone, MapPin, Star, Calendar, Users, Shield, Edit2, Car, MapPinned, X, Check } from 'lucide-react';

function Profile() {
  const { user } = useUser();
 
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  useEffect(() => {
  if (user) {
    setEditData({
      name: user.name || '',
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    });
  }
}, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-gray-400 text-lg">Loading profile...</div>
      </div>
    );
  }

  const handleEditChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name || '',
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    });
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {isEditMode ? (
              <div className="relative group">
                <img
                  src={editData.avatar || user.avatar}
                  alt={editData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl cursor-pointer"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <span className="text-white text-sm font-medium">Change</span>
                </label>
                {user.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <img
                  src={editData.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
                {user.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 text-center md:text-left space-y-3">
              {isEditMode ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="text-3xl md:text-4xl font-bold bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
                />
              ) : (
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold">{editData.name}</h1>
                  {user?.isVerified && (
                    <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      <Shield className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-white/90">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-lg">{user.rating.toFixed(1)}</span>
                  <span className="text-sm">rating</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                <div className="flex items-center gap-1.5">
                  <Car className="w-5 h-5" />
                  <span className="font-medium">{user.hostedTrips.length} trips hosted</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/80 text-sm">
                <span className="capitalize bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{user.gender}</span>
              </div>
            </div>

            {isEditMode ? (
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 transition-all p-2.5 rounded-full shadow-lg"
                >
                  <Check className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-500 hover:bg-red-600 transition-all p-2.5 rounded-full shadow-lg"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-2.5 rounded-full group"
              >
                <Edit2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-orange-500 rounded-full"></div>
                  About Me
                </h2>
                {isEditMode && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Editable</span>
                )}
              </div>
              {isEditMode ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleEditChange('bio', e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="w-full h-32 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {editData.bio || 'No bio added yet. Tell others about yourself!'}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-orange-500 rounded-full"></div>
                  Hosted Trips
                  <span className="text-sm font-normal text-gray-500">({user.hostedTrips.length})</span>
                </h2>
              </div>

              {user.hostedTrips.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No trips hosted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.hostedTrips.map((trip) => (
                    <div
                      key={trip._id}
                      className="border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPinned className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-800">{trip.from.name}</span>
                          </div>
                          <div className="flex items-center gap-2 ml-7">
                            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-orange-500 rounded-full"></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-orange-600" />
                            <span className="font-semibold text-gray-800">{trip.to.name}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          trip.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {trip.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(trip.tripDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {trip.tripTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{trip.availableSeats} seats available</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">₹{trip.basePrice.toLocaleString()}</span>
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all opacity-0 group-hover:opacity-100">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-orange-500 rounded-full"></div>
                  Joined Trips
                  <span className="text-sm font-normal text-gray-500">({user.joinedTrips.length})</span>
                </h2>
              </div>

              {user.joinedTrips.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No trips joined yet</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {user.joinedTrips.map((trip) => (
                    <div key={trip._id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-all">
                      <div className="font-medium text-gray-800">
                        {trip.from.name} → {trip.to.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-orange-500 rounded-full"></div>
                Contact
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-800 font-medium break-all">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    {isEditMode ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => handleEditChange('phone', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-800 font-medium">{editData.phone}</p>
                    )}
                  </div>
                </div>

                {(user.address.city || user.address.state) && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Address</p>
                      <p className="text-sm text-gray-800 font-medium">
                        {[user.address.houseNumber, user.address.street, user.address.city, user.address.state, user.address.postalCode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Profile Stats</h3>
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <span className="text-sm">Rating</span>
                  <span className="font-bold text-xl">{user.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <span className="text-sm">Trips Hosted</span>
                  <span className="font-bold text-xl">{user.hostedTrips.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <span className="text-sm">Trips Joined</span>
                  <span className="font-bold text-xl">{user.joinedTrips.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
